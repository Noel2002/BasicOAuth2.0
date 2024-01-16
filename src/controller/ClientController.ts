import { randomBytes } from "crypto";
import { AppDataSource } from "../data-source";
import { Client } from "../entity/Client";
import {Request, Response} from 'express';

export class ClientController {
    private _clientRepository = AppDataSource.getRepository(Client);

    async create(request: Request, response: Response){
        try {
            const clientSecret = randomBytes(32).toString('hex');
            const obj = Object.assign(new Client(), {
                ...request.body,
                client_secret: clientSecret
            });
            const client = await this._clientRepository.save(obj);
            return response.status(201).json({client});
        } catch (error) {
            response.status(500).send(error.message);
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

            if(!client) return response.sendStatus(404);

            return response.status(200).json({client});
        } catch (error) {
            response.status(500).send(error.message);
        }
    }
    async delete(request: Request, response: Response){
        try {
            const id = request.params.id;
            const client = await this._clientRepository.findOne({where:{id}});
            if(!client) return response.sendStatus(404);
            await this._clientRepository.remove(client);
            return response.status(200).send("Client deleted successfully!");
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

}