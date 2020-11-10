import 'source-map-support/register';
import { getProductById } from './handlers/getProductById';
import { getProducts } from './handlers/getProducts';
import { addProduct } from './handlers/addProduct';
import { invoke } from './handlers/invoke';

export { getProductById, getProducts, addProduct, invoke }
