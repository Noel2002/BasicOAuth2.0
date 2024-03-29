import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User";
import {config} from "dotenv";
import { Client } from "./entity/Client";
import { Privilege } from "./entity/Privilege";
import { AuthorizationCode } from "./entity/AuthorizationCode";

// dotenv configuration
config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Client, Privilege, AuthorizationCode],
    migrations: [],
    subscribers: [],
})
