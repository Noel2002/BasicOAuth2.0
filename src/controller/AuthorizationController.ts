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

export class AuthorizationController {
    private _authorizationCodeRepository = AppDataSource.getRepository(AuthorizationCode);
    private _userService = new UserService();
    private _clientRepository = AppDataSource.getRepository(Client);
    private _privelegeService = new PrivilegeService();

    async authorize(request: Request, response: Response){
        try {
            const queryString = stringify(request.query);
            response.writeHead(302, {
                Location: `http://localhost:8000/dialog.html?${queryString}`
            });
            return response.end();
          
        } catch (error) {
            return response.status(500).send(error.message);
        }
    }

    async authenticate(request: Request, response: Response){
        try {            
            const { client_id, redirect_uri, scope, state, email, password} = request.body;
            const user = await this._userService.login(email, password);
            if(!user) return response.status(401).json({error: "Unauthorized"});

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
            const tags = scope.split("+");
            const privileges = await this._privelegeService.getPrivilegesFromScopes(tags);

            // create authcode
            const authCode = await this._authorizationCodeRepository.save(obj);
            return response.status(201).json({...authCode, privileges})
        } catch (error) {
            console.log(error.message);
            response.status(500).json({error: error.message});
        }
    }

    async createToken(request: Request, response: Response){
        try {
            const {grant_type, code, client_id, client_secret, redirect_uri, state} = request.body;
    
            const client = await this._clientRepository.findOne({where: {id: client_id}});
            if(!client) return response.status(400).json({error: "Invalid client id!"});
    
            const authCode = await this._authorizationCodeRepository.findOne({where: {code: code}, relations: {user: true}});
            if(!authCode) return response.status(400).json({error: 'Invalid authorization code'});
    
            if(grant_type !== 'authorization_code') return response.status(400).json({error: "invalid grant_type"});
    
            if(redirect_uri !== client.redirectUrl) return response.status(400).json({error: "Redirect URI does not match the registered URI."});
    
            if(state !== authCode.state) return response.status(400).json({error: "State variable does not match initial value"});
    
            if(client_secret !== client.clientSecret) return response.status(400).json({error: "Invalid client_secret"});
    
            /** token expires in 24 hours */
            const expiresAt = Math.floor(Date.now()/1000 + (24*60*60));
            const payload = {
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