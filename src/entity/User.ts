import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import {hash} from 'bcrypt';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(){
        if(this.password){
            const saltRounds = 10;
            this.password = await hash(this.password, saltRounds);
        }
    }

}
