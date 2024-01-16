import { AppDataSource } from "../data-source";
import {Request, Response} from 'express';
import { Privilege } from "../entity/Privilege";

export class PrivilegeController {
    private _privilegeRepository = AppDataSource.getRepository(Privilege);

    async create(request: Request, response: Response){
        try {
            const obj = Object.assign(new Privilege(), {
                ...request.body,
            });
            const privilege = await this._privilegeRepository.save(obj);
            return response.status(201).json({privilege});
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async getAll(request: Request, response: Response){
        try {
            const privileges = await this._privilegeRepository.find();
            return response.status(200).json({privileges});
        } catch (error) {
            
        }
    }

    async getById(request: Request, response: Response){
        try {
            const id = request.params.id;
            const privilege = await this._privilegeRepository.findOne({where: {id}});

            if(!privilege) return response.sendStatus(404);

            return response.status(200).json({privilege});
        } catch (error) {
            response.status(500).send(error.message);
        }
    }
    async delete(request: Request, response: Response){
        try {
            const id = request.params.id;
            const privilege = await this._privilegeRepository.findOne({where:{id}});
            if(!privilege) return response.sendStatus(404);
            await this._privilegeRepository.remove(privilege);
            return response.status(200).send("Privilege deleted successfully!");
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

}