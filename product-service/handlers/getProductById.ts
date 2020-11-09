import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {Client} from 'pg';
import {dbOptions} from '../helpers/pg'
import {headers} from '../helpers/headers'

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    const client = new Client(dbOptions);
    await client.connect();


    console.log('connected to DB');

    let err;
    let resultProduct;
    const {productId} = event.pathParameters;

    console.log('GET Product By ID request');

    try {
        const {
            rows: resultProductRows,
        } = await client.query(
            `select products.*, stocks.count from products left join stocks on products.id=stocks.product_id where products.id=$1`,
            [productId]
        );
        resultProduct = resultProductRows[0];

        if (!resultProduct) {
            throw "Product does not exist";
        }

    } catch (error) {
        err = `no product, error: ${error}`;
    } finally {
        client.end();
    }

    return {
        statusCode: !err ? 200 : 500,
        headers,
        body: !err ? JSON.stringify(resultProduct) : err,
    };
}
