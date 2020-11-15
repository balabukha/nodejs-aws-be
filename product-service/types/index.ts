
export interface IProduct {
    count: number;
    description: string;
    id: string;
    price: number;
    title: string;
}

export interface IdbOptions {
    host: string,
    port: number,
    database: string,
    user: string,
    password: string,
    ssl: {
        rejectUnauthorized: boolean
    },
    connectionTimeoutMillis: number
}
