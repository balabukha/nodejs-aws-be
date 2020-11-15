import {Client} from 'pg';
import {dbOptions} from '../helpers/pg'

export const createClient = async () => {
    const client = new Client(dbOptions);

    await client.connect();

    return client
};
