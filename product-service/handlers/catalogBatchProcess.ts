import {SNS} from 'aws-sdk';
import {createClient} from '../loaders/db';
import {headers} from '../helpers/headers';
import {AWS_REGION} from '../helpers/constants';
import {IProduct} from '../types';

export const catalogBatchProcess: any = async event => {
    const client = await createClient();
    const sns = new SNS({region: AWS_REGION});
    await client.connect();

    try {
        let products: IProduct[] = event.Records.map(({body}) => {
            const {title, description, price, count} = JSON.parse(body);
            const isValid = Boolean(title && description && price && count);

            if (!isValid) {
                console.log('product data: ', title, description, price, count);
                return {error: 'The Product is not valid, please fill all data'}
            } else {
                return JSON.parse(body);
            }
        });

        for (let product of products) {
            await client.query('BEGIN');
            let dbRequest = `
                insert into products (title, description, price, image) values
                ('${product.title}', '${product.description}', ${product.price})
                returning id;
            `;
            const newProduct = await client.query(dbRequest);
            console.log('dbRequest', dbRequest);
            const productId = newProduct.rows[0].id;

            dbRequest = `
                insert into stocks (product_id, count) values
                ('${productId}', ${product.count})
            `;
            console.log('dbRequest', dbRequest);
            await client.query(dbRequest);

            await client.query('COMMIT');

            await sns.publish({
                Subject: 'Product parsed and added to DB',
                Message: JSON.stringify(product),
                TopicArn: process.env.SNS_ARN,
            }).promise();
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({message: 'Completed'}),
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.log('error', error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal Server Error'}),
        }
    } finally {
        await client.end();
    }
};
