import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import {headers} from '../helpers/headers';
import { BUCKET, AWS_REGION } from '../helpers/constants';

export const importProductsFile:APIGatewayProxyHandler = async (event) => {
    console.log('Lambda function has been invoked with event:', JSON.stringify(event));

    const {queryStringParameters: {name} = {}} = event;
    const path = `uploaded/${name}`;
    const s3 = new S3({region: AWS_REGION});
    const params = {
        Bucket: BUCKET,
        Key: path,
        Expires: 60,
        ContentType: 'text/csv'
    };

    try {
        const url = await s3.getSignedUrl('putObject', params);

        console.log(url);
        return {
            statusCode: 200,
            headers,
            body: url
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }
};
