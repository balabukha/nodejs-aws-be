import {headers} from '../helpers/headers'
import {createClient} from '../loaders/db';

export const addProduct = async (event) => {
    console.log(JSON.stringify(event));

    const {body = null} = event || {};
    const product = body ? JSON.parse(body) : {};
    const {title = '', description = '', price = null, count = null} = product;

    const client = await createClient();

    try {
        const isValid = Boolean(title && description && price && count);
        if (!isValid) return {
            statusCode: 400,
            headers,
            body: JSON.stringify({error: 'The Product is not valid, please fill all data'})
        };
        await client.query('BEGIN');

        const {rows: [{id}]} = await client.query(
            `insert into products (title, description, price) 
            values ($1, $2, $3)
            returning id`,
            [title, description, price]);

        await client.query(
            `insert into stocks (product_id, count) 
            values ($1, $2)`, [id, count]);

        await client.query('COMMIT');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({id}),
        };

    } catch (e) {
        await client.query('ROLLBACK');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({error: 'Internal Server Error'})
        }
    } finally {
        client.end();
    }
};
