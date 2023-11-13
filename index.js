const dotenv = require('dotenv');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fileUpload = require('express-fileupload');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(
    fileUpload({
        safeFileNames: true,
        preserveExtension:true
    })
);

// Database variable
const db = mysql.createConnection({
    user: process.env.DB_USERNAME,
    host: process.env.HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Route for signing in as admin
app.post('/login', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, result) => {
        if (error) console.log(error);
        else response.send(result);
    });
});

// Route for getting all products
app.get('/products', (request, response) => {
    db.query('SELECT * FROM products', (error, result) => {
        if (error) console.log(error);
        else response.send(result);
    });
});

// Route for getting a product
app.get('/products/:id', (request, response) => {
    const id = request.params.id;

    db.query('SELECT * FROM products WHERE id = ?', id, (error, result) => {
        console.log(result);
        if (error) console.log(error);
        else response.send(result);
    });
});

// Returns product object with all the non-image product info
const product = (request) => {
    const product = {
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        quantity: request.body.quantity
    }

    return product;
}

// handles uploading image to designated uploads folder
function moveImage (image) {
    imageName = `${Date.now()}_${image.name}`;
    let path = `../ecommerce-webapp/src/assets/images/products/${imageName}`;
    image.mv(path, (error) => {
        if (error) console.log(error);
    });
}

// Route for creating a product
app.post('/products/create', (request, response) => {
    let { name, description, price, quantity } = product(request);
    let imageName = '';

    if (!request.files || !request.files.image) imageName = 'product-placeholder.png';
    else  moveImage(request.files.image);

    db.query('INSERT INTO products (name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)', [name, description, price, quantity, imageName], (error, result) => {
        if (error) console.log(error);
        else response.send('A product created.');
    });
});

// Route for updating a product
app.put('/products/:id/update', (request, response) => {
    let { name, description, price, quantity } = product(request);

    if(request.files && request.files.image) {
        moveImage(request.files.image);

        db.query('UPDATE products SET image = ? WHERE id = ?', [imageName, id], (error, result) => {
            if (error) console.log(error);
        });
    }

    db.query('UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?', [name, description, price, quantity, id], (error, result) => {
        if (error) console.log(error);
        else response.send('Product has been updated.');
    });
});

// Route for deleting a product
app.delete('/products/:id/delete', (request, response) => {
    const id = request.params.id;

    db.query('DELETE FROM products WHERE id = ?', id, (error, result) => {
        if (error) console.log(error);
        else response.send('A product has been deleted.');
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});