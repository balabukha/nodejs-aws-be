import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import db from '../db';

const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
};

export const getProducts: APIGatewayProxyHandler = async () => {

    const data = await db;

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data, null, 2),
    };
}
