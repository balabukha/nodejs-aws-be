import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import {dbOptions} from '../helpers/pg'
import {headers} from '../helpers/headers'

export const getProducts: APIGatewayProxyHandler = async () => {

    const client = new Client(dbOptions);
    await client.connect();

    console.log('Get all products request');

    try {
        const result = await client.query(`select products.*, stocks.count
      from products left join stocks on products.id = stocks.product_id;`),
            data = [...result.rows];

        console.log('data', data);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };
    } catch (e) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify(e.message)
        };
    } finally {
        await client.end();
    }
};
