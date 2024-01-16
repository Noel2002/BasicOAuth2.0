import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Privilege {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    scope: string;

    @Column()
    description: string;
}