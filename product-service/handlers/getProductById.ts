import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {products} from '../mocks/productsMockData';

const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
};

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    const {productId} = event.pathParameters;
    const product = products.find(product => product.id === productId);

    if (Object.keys(product).length) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(product, null, 2),
        };
    }

    return {
        statusCode: 404,
        body: JSON.stringify(`product wasn't found`, null, 2),
    };
}
