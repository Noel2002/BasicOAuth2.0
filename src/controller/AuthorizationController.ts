import { randomBytes } from 'crypto';
import {Request, Response} from 'express';
import { AppDataSource } from '../data-source';
import { AuthorizationCode } from '../entity/AuthorizationCode';
import {stringify}  from 'node:querystring'
import { UserService } from '../services/User.service';
import { Client } from '../entity/Client';
import {sign} from 'jsonwebtoken';
import { privateKey } from '../config';
import { PrivilegeService } from '../services/Privilege.service';
import { AccessTokenPayload } from '../types/token';

export class AuthorizationController {
    private _authorizationCodeRepository = AppDataSource.getRepository(AuthorizationCode);
    private _userService = new UserService();
    private _clientRepository = AppDataSource.getRepository(Client);
    private _privelegeService = new PrivilegeService();

    async authorize(request: Request, response: Response){
        try {
            const {client_id, scope, redirect_uri, response_type} = request.query;
            let errorResponse: {error: string, message: string} = {
                error: null,
                message: null
            };

            const client = await this._clientRepository.findOne({where: {id: client_id}});
            
            if(!client){
                errorResponse.error = "unrecognized_client_id";
                errorResponse.message = "Client does not exist. Please check if you provided a correct ID";
                response.writeHead(302, {
                    Location: `http://localhost:8000/error.html?${stringify(errorResponse)}`
                });
                return response.end();
            }
            
            if(client.redirectUrl !== redirect_uri){
                errorResponse.error = "";
                errorResponse.message = "The redirect URL does not match with the one client registered";
                response.writeHead(302, {
                    Location: `http://localhost:8000/error.html?${stringify(errorResponse)}`
                });
                return response.end();
            }
            
            if(response_type !== "code"){
                errorResponse.error = "unsupported_response_type";
                errorResponse.message = `Authorization server does not support the response type -${response_type} prodivded. Server only supports "code"`;
                response.writeHead(302, {
                    Location: `${redirect_uri}?${stringify(errorResponse)}`
                });
                return response.end();
            }

            const scopes = scope.split(" ");            
            const isScopesValid = await this._privelegeService.validateScopes(scopes);
            if(!isScopesValid){
                errorResponse.error = "invalid_scope";
                errorResponse.message = "The scope provided is not valid and supported by the authorization server";
                response.writeHead(302, {
                    Location: `${redirect_uri}?${stringify(errorResponse)}`
                });
                return response.end();
            }

            const queryString = stringify(request.query);
            response.writeHead(302, {
                Location: `http://localhost:8000/dialog.html?${queryString}`
            });
            return response.end();
          
        } catch (error) {
            console.log(error.message);            
            return response.status(500).json({error: error.message});
        }
    }

    async authenticate(request: Request, response: Response){
        try {            
            const { client_id, redirect_uri, scope, state, email, password} = request.body;
            const user = await this._userService.login(email, password);
            if(!user) return response.status(401).json({error: "Unauthorized! Invalid email or passoword"});

            const client = await this._clientRepository.findOne({where: {id: client_id}});
            if(!client) return response.status(400).json({error: "Client cannot be found"});

            let code = randomBytes(16).toString('hex');
            while(await this._authorizationCodeRepository.existsBy({code})){
                code = randomBytes(16).toString('hex');
            }
            const obj = Object.assign(new AuthorizationCode(), {
                code: code,
                client,
                redirectUrl: redirect_uri,
                scope: scope,
                state: state,
                user,
            });
            
            // retrieve the privileges from the scopes
            const tags = scope.split(" ");
            const privileges = await this._privelegeService.getPrivilegesFromScopes(tags);

            // create authcode
            const authCode = await this._authorizationCodeRepository.save(obj);
            return response.status(201).json({...authCode, privileges, client: {name: client.name}})
        } catch (error) {
            console.log(error.message);
            response.status(500).json({error: error.message});
        }
    }

    async createToken(request: Request, response: Response){
        try {
            const {grant_type, code, redirect_uri} = request.body;
            
            const authorizationHeader = request.headers.authorization;
            if(!authorizationHeader) return response.status(400).json({error: "Missing authorizaiton header"});
            
            const authvals = authorizationHeader.split(" ");
            if(authvals.length < 2) return response.status(400).json('Invalid authorization header format. Format: Basic <base64>')
            
            const token = Buffer.from(authvals[1], 'base64').toString();
            
            const credentials = token.split(":");
            if(credentials.length<2) return response.status(400).json("Invalid Basic auth credentials. Credentials should be separeted by a colon':'");
            
            const client_id = credentials[0];
            const client_secret = credentials[1]; // retrieving client secret from the authorization header credentials
            const client = await this._clientRepository.findOne({where: {id: client_id}});
            if(!client) return response.status(400).json({error: "Invalid client id!"});
            // console.log({client, body: request.body});
            
            const authCode = await this._authorizationCodeRepository.findOne({where: {code: code}, relations: {user: true}});
            if(!authCode) return response.status(400).json({error: 'Invalid authorization code'});
            
            if(grant_type !== 'authorization_code') return response.status(400).json({error: "invalid grant_type"});
            
            if(redirect_uri !== client.redirectUrl) return response.status(400).json({error: "Redirect URI does not match the registered URI."});
            
            // console.log({client_secret, client: client.clientSecret, judge: client_secret === client.clientSecret});
            if(client_secret !== client.clientSecret) return response.status(400).json({error: "Invalid client_secret"});
    
            /** token expires in 24 hours */
            const expiresAt = Math.floor(Date.now()/1000 + (24*60*60));
            const payload: AccessTokenPayload = {
                'iss': process.env.ISSUER_URL,
                'exp': expiresAt,
                'aud': 'resource_server',
                'sub': authCode.user.id,
                'client_id':client.id,
                'iat': Date.now(),
                'jti': randomBytes(16).toString('hex'),
                'scope': authCode.scope,
            }            
            const accesstoken = sign(payload, privateKey, {algorithm: 'RS256'});

            // destroy the code
            await this._authorizationCodeRepository.remove(authCode);

            return response.status(200).json({
                access_token: accesstoken,
                token_type: 'Bearer',
                expiresAt,
                scope: authCode.scope
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({error: error.message});
        }



    }
}