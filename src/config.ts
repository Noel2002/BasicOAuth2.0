import { readFileSync } from "fs";

export const privateKey = readFileSync('./private.key', 'utf-8');