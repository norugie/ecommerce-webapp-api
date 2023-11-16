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

app.use('/products', PRODUCT_ROUTES);

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3001');
});