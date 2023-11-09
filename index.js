const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fileUpload = require('express-fileupload');

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
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'ecommerce_webapp_api'
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

// Route for creating a product
app.post('/products/create', (request, response) => {
    const name = request.body.name;
    const description = request.body.description;
    const price = request.body.price;
    const quantity = request.body.quantity;
    let imageName = '';

    if (!request.files || !request.files.image) imageName = 'product-placeholder.png';
    else {
        let image = request.files.image;
        imageName = `${Date.now()}_${image.name}`;
        let path = `../ecommerce-webapp/src/assets/images/products/${imageName}`;
        image.mv(path, (error) => {
            if (error) console.log(error);
        });
    }

    db.query('INSERT INTO products (name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)', [name, description, price, quantity, imageName], (error, result) => {
        if (error) console.log(error);
        else response.send('New product created.');
    });
});

// Route for updating a product
app.put('/products/:id/update', (request, response) => {
    const id = request.params.id;
    const name = request.body.name;
    const description = request.body.description;
    const price = request.body.price;
    const quantity = request.body.quantity;

    if(request.files && request.files.image) {
        let image = request.files.image;
        let imageName = `${Date.now()}_${image.name}`;
        let path = `../ecommerce-webapp/src/assets/images/products/${imageName}`;
        image.mv(path, (error) => {
            if (error) console.log(error);
        });

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
        else response.send(result);
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});