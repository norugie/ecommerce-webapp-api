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
    const id = request.params.id;

    try {
        const product = await selectProduct(id);

        response.send(product);
    } catch (error) {
        console.log(error);
        return null;
    }
});

// Route for creating a product
PRODUCT_ROUTES.post('/create', async (request, response) => {
    console.log(request.body);
    try {
        await createProduct(request)

        response.send('A new product has been created.');
    } catch (error) {
        console.log(error);
        return null;
    }
});

// // Route for updating a product
// PRODUCT_ROUTES.put('/:id/update', (request, response) => {
//     const id = request.params.id;
//     let { name, description, price, quantity } = product(request);

//     if(request.files && request.files.image) {
//         let imageName = moveImage(request.files.image);

//         db.query('UPDATE products SET image = ? WHERE id = ?', [imageName, id], (error, result) => {
//             if (error) console.log(error);
//         });
//     }

//     db.query('UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?', [name, description, price, quantity, id], (error, result) => {
//         if (error) console.log(error);
//         else response.send('Product has been updated.');
//     });
// });

// // Route for deleting a product
// PRODUCT_ROUTES.delete('/:id/delete', (request, response) => {
//     const id = request.params.id;

//     db.query('DELETE FROM products WHERE id = ?', id, (error, result) => {
//         if (error) console.log(error);
//         else response.send('A product has been deleted.');
//     });
// });