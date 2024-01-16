import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Privilege } from "./Privilege";

@Entity()
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    clientSecret: string;

    @Column({unique:true})
    name: string;

    @Column()
    redirectUrl: string;

    @ManyToMany(()=> Privilege)
    @JoinTable()
    privileges: Privilege[]

}