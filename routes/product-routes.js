import express from 'express';
import { selectProducts, selectProduct, createProduct, updateProduct, deleteProduct } from '../queries/product-queries.js';

export const PRODUCT_ROUTES = express.Router();

// Route for getting all products
PRODUCT_ROUTES.get('/', async (request, response) => {
    try {
        const products = await selectProducts();

        response.send(products);
    } catch (error) {
        console.log(error);
        return null;
    }
});

// Route for getting a product
PRODUCT_ROUTES.get('/:id', async (request, response) => {
    try {
        const product = await selectProduct(request.params.id);

        response.send(product);
    } catch (error) {
        console.log(error);
        return null;
    }
});

// Route for creating a product
PRODUCT_ROUTES.post('/create', async (request, response) => {
    try {
        await createProduct(request)

        response.send('A new product has been created.');
    } catch (error) {
        console.log(error);
        return null;
    }
});

// Route for updating a product
PRODUCT_ROUTES.put('/:id/update', async (request, response) => {
    try {
        await updateProduct(request.params.id, request);

        response.send('A product has been updated.');
    } catch (error) {
        console.log(error);
        return null;
    }
});

// Route for deleting a product
PRODUCT_ROUTES.delete('/:id/delete', async (request, response) => {
    try {
        await deleteProduct(request.params.id);

        response.send('A product has been deleted.');
    } catch (error) {
        console.log(error);
        return null;
    }
});