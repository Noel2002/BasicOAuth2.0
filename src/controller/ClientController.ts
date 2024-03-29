import { randomBytes } from "crypto";
import { AppDataSource } from "../data-source";
import { Client } from "../entity/Client";
import {Request, Response} from 'express';
import { PrivilegeService } from "../services/Privilege.service";

export class ClientController {
    private _clientRepository = AppDataSource.getRepository(Client);
    private _privilegeService = new PrivilegeService();

    async create(request: Request, response: Response){
        try {
            const clientSecret = randomBytes(32).toString('hex');
            const obj = Object.assign(new Client(), {
                ...request.body,
                clientSecret: clientSecret
            });
            const client = await this._clientRepository.save(obj);
            return response.status(201).json({client});
        } catch (error) {
            response.status(500).json({message: error.message});
        }
    }

    async getAll(request: Request, response: Response){
        try {
            const clients = await this._clientRepository.find();
            return response.status(200).json({clients});
        } catch (error) {
            
        }
    }

    async getById(request: Request, response: Response){
        try {
            const id = request.params.id;
            const client = await this._clientRepository.findOne({where: {id}});

            if(!client) return response.status(404).json({error: "Client not found"});

            return response.status(200).json({client});
        } catch (error) {
            response.status(500).json({message: error.message});
        }
    }
    async delete(request: Request, response: Response){
        try {
            const id = request.params.id;
            const client = await this._clientRepository.findOne({where:{id}});
            if(!client) return response.status(404).json({error: "Client does not exist!"});
            await this._clientRepository.remove(client);
            return response.status(200).send("Client deleted successfully!");
        } catch (error) {
            response.status(500).json({message: error.message});
        }
    }

    async addPrivileges(request: Request, response: Response){
        try {
            const id = request.params.id;
            const client = await this._clientRepository.findOne({where:{id}, relations: {privileges: true}});
            if(!client) return response.status(404).json({error: "Client does not exist"});

            const scopes = request.body.scopes;

            // TODO: Filter out already existing scopes

            const privileges = await this._privilegeService.getPrivilegesFromScopes(scopes);
            client.privileges = [...client.privileges, ...privileges];
            const newClient = await this._clientRepository.save(client);
            return response.status(201).json({client: newClient});

        } catch (error) {
            response.status(500).json({message: error.message});
        }
    }

}