import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User";
import bcrypt from 'bcryptjs';


export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async getAll(request: Request, response: Response, next: NextFunction) {
        console.log(bcrypt);
        
        const users = await this.userRepository.find();
        return response.status(200).json({users});
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id;

        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return response.sendStatus(404);
        }

        return response.status(200).json({user});
    }

    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const {password} = request.body;
            
            const user = Object.assign(new User(), {
               ...request.body
            });
    
            await this.userRepository.save(user);
            response.status(201).json({message:"User created successfully"});
        } catch (error) {
            response.status(500).json({error: error.message});
        }
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
    
            const userToRemove = await this.userRepository.findOneBy({ id });
    
            if (!userToRemove) {
                return response.status(404).json({error: "User does not exist!"});
            }
    
            await this.userRepository.remove(userToRemove);
            response.status(200).send("user deleted successfully");
        } catch (error) {
            response.status(500).json({error: error.message});
        }

    }

}