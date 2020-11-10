import {APIGatewayProxyHandler} from 'aws-lambda';

const {Client} = require('pg');
const {PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env;

const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // to avoid warring in this example
    },
    connectionTimeoutMillis: 5000 // time in millisecond for termination of the database query
};

export const invoke: APIGatewayProxyHandler = async () => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        //make ddl query for creation table
        const ddlResult = await client.query(`
      create table if not exists products (
        id uuid primary key default uuid_generate_v4(),
        title text not null,
        description text,
        price integer
      )`
        );

        const ddlResult2 = await client.query(`  
      create table if not exists stocks (
        product_id uuid,
        count integer,
        foreign key ("product_id") references "products" ("id")
      )`
        );
        console.log('[db-1]===>> ', ddlResult, ddlResult2);

        // make select query
        const {rows: products} = await client.query(`select * from products`);
        console.log(products);

        return products;
    } catch (err) {
        // you can process error here. In this example just log it to console.
        console.error('Error during database request executing:', err);
    } finally {
        // in case if error was occurred, connection will not close automatically
        client.end(); // manual closing of connection
    }
};
