import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Client } from "./Client";

@Entity()
export class AuthorizationCode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> Client)
    @JoinColumn()
    client: Client;

    @Index({unique: true})
    @Column()
    code: string;

    @Column()
    redirectUrl: string;

    @Column()
    scope: string;

    @Column()
    state: string;

    @ManyToOne(()=> User)
    @JoinColumn()
    user: User;
}