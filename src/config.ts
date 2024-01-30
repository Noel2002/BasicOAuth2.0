import { readFileSync } from "fs";

export const privateKey = readFileSync('./private.key', 'utf-8');
export const publicKey = readFileSync('./public.key', 'utf-8');