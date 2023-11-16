// const dotenv = require('dotenv');
// const express = require('express');
// const cors = require('cors');
// const fileUpload = require('express-fileupload');

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { selectUser } from './queries/user-queries.js';
import { PRODUCT_ROUTES } from './routes/product-routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(
    fileUpload({
        safeFileNames: true,
        preserveExtension:true
    })
);

// Route for signing in as admin
app.post('/login', async (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    const user = await selectUser(username, password);

    if (!user)
        return response.status(401).send({ message: 'Not Authorized' });

    response.status(200).send(user);
});

// // Route for creating a product
// app.post('/products/create', async (request, response) => {
//     const productData = {
//         name: request.body.name,
//         description: request.body.description,
//         price: request.body.price,
//         quantity: request.body.quantity
//     }

//     const image = await request.files.image;
//     const imageName = `${Date.now()}_${image.name}`;
//     let path = `../ecommerce-webapp/src/assets/images/products/${imageName}`;
//     image.mv(path, (error) => {
//         if (error) console.log(error);
//     });
    
//     console.log(productData);
//     // try {
//     //     await createProduct(request)

//     //     response.send('A new product has been created.');
//     // } catch (error) {
//     //     console.log(error);
//     //     return null;
//     // }
// });

app.use('/products', PRODUCT_ROUTES);

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3001');
});