import { randomBytes } from 'crypto';
import {Request, Response} from 'express';
import { AppDataSource } from '../data-source';
import { AuthorizationCode } from '../entity/AuthorizationCode';
import {stringify}  from 'node:querystring'
import { UserService } from '../services/User.service';
import { Client } from '../entity/Client';
export class AuthorizationController {
    private _authorizationCodeRepository = AppDataSource.getRepository(AuthorizationCode);
    private _userService = new UserService();
    private _clientRepository = AppDataSource.getRepository(Client);

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
            if(!user) return response.sendStatus(401);

            const client = await this._clientRepository.findOne({where: {id: client_id}});
            if(!client) return response.status(400).send("Client cannot be found");

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
    
            const authCode = await this._authorizationCodeRepository.save(obj);
            return response.status(201).json({...authCode})
        } catch (error) {
            console.log(error.message);
            response.status(500).send(error.message);
        }
    }
}