import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import {compareSync} from 'bcrypt';

export class UserService {
    private _userRepository = AppDataSource.getRepository(User);

    async login(email: string, password: string): Promise<User>{
        const user = await this._userRepository.findOne({where:{email}});
        if(!user) return null;

        const check:boolean = compareSync(password, user.password);
        if(!check) return null;

        return user;
    }
}