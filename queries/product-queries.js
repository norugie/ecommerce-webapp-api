import db from '../config/mysql.js';

// Returns product object with all the non-image product info
const productData = (request) => {
    const productData = {
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        quantity: request.body.quantity
    }

    return productData;
}

// Handles uploading image to designated uploads folder
function moveImage (image) {
    imageName = `${Date.now()}_${image.name}`;
    let path = `../ecommerce-webapp/src/asset/${imageName}`;
    image.mv(path, (error) => {
        if (error) console.log(error);
    });
    return imageName;
}


export const selectProducts = async () => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        console.log(products);
        return products;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const selectProduct = async (id) => {
    try {
        const [product] = await db.query('SELECT * FROM products WHERE id = ?', id);

        return product[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const createProduct = async (product) => {
    let { name, description, price, quantity } = await productData(product);
    let imageName = '';

    if (!product.files || !product.files.image) imageName = 'product-placeholder.png';
    else  imageName = moveImage(product.files.image);

    try {
        await db
        .query('INSERT INTO products (name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)', 
        [name, description, price, quantity, imageName], 
        (error, result) => { 
            if (error) console.log(error); 
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const updateProduct = async (id, product) => {
    try {

    } catch (error) {
        console.log(error);
        return null;
    }
}

export const deleteProduct = async (id) => {
    try {

    } catch (error) {
        console.log(error);
        return null;
    }
}