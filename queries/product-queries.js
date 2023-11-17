import db from '../config/mysql.js';

// Returns product object with all the non-image product info
const getProductData = (product) => {
    const productData = {
        name: product.body.name,
        description: product.body.description,
        price: product.body.price,
        quantity: product.body.quantity
    }

    return productData;
}

// Returns an image name after handling image upload to designated uploads directory
const getImageName = (image) => {
    let imageName = `${Date.now()}_${image.name}`;
    let path = `../ecommerce-webapp/src/assets/images/products/${imageName}`;
    image.mv(path, (error) => {
        if (error) console.log(error);
    });

    return imageName;
}


export const selectProducts = async () => {
    try {
        const [products] = await db.query('SELECT * FROM products');

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
    try {
        let { name, description, price, quantity } = await getProductData(product);
        let imageName = 'product-placeholder.png';
    
        if (product.files && product.files.image) 
            imageName = getImageName(product.files.image);

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
        let { name, description, price, quantity } = await getProductData(product);

        if(product.files && product.files.image) {
            let imageName = getImageName(product.files.image);
    
            await db
            .query('UPDATE products SET image = ? WHERE id = ?', 
            [imageName, id], 
            (error, result) => {
                if (error) console.log(error);
            });
        }

        await db
        .query('UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?', 
        [name, description, price, quantity, id], 
        (error, result) => {
            if (error) console.log(error);
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const deleteProduct = async (id) => {
    try {
        await db
        .query('DELETE FROM products WHERE id = ?', 
        id, 
        (error, result) => {
            if (error) console.log(error);
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}