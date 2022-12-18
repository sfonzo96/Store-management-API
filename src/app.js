import express from 'express';
import ProductManager from './productManager.js';
import { productsRouter } from './routers/products.router.js';
import { cartsRouter } from './routers/users.router.js';

const app = express();

const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
    console.log(`🔥 Listening on port ${PORT}`);
});

