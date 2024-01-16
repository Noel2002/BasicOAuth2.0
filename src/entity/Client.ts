import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    client_secret: string;

    @Column({unique:true})
    name: string;

}