import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {products} from '../mocks/productsMockData';

const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
};

export const getProducts: APIGatewayProxyHandler = async () => {

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products, null, 2),
    };
}
