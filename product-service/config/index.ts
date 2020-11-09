import dotenv from 'dotenv';

dotenv.config();

export const PG_HOST = process.env.PG_HOST;
export const PG_PORT = parseInt(process.env.PG_PORT);
export const PG_DATABASE = process.env.PG_DATABASE;
export const PG_USERNAME = process.env.PG_USERNAME;
export const PG_PASSWORD = process.env.PG_PASSWORD;
