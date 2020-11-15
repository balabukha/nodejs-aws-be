import * as AWS from 'aws-sdk';
import {headers} from '../helpers/headers';

const BUCKET: string = 'node-aws-s3';

export const importProductsFile = async (event) => {
    console.log('Lambda function has been invoked with event:', JSON.stringify(event));

    const {queryStringParameters: {name} = {}} = event;
    const path = `uploaded/${name}`;
    const s3 = new AWS.S3({region: 'eu-west-1'});
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
