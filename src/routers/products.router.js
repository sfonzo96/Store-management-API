import { Router } from "express";
import ProductManager from "../productManager.js";
import Product from "../Product.js";

const productsRouter = Router();

const productManager = new ProductManager();

productsRouter.get('/', (req, res) => {
    const { limit } = req.query;
    if (!limit) {
        const products = productManager.getProducts();
        res.json(products);
    } else {
        const productsQuery = productManager.getProducts().slice(0, limit);
        res.json(productsQuery);
    }
})

productsRouter.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = productManager.getProductById(pid);
    res.json(product);
})

productsRouter.post('/', (req, res) => {
    const { title, description, price, thumbnail, stock, code, category, status } = req.body;
    const product = new Product(title, description, price, thumbnail, stock, code, category, status);
    productManager.addProduct(product);
    res.json(product);
});

productsRouter.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, price, thumbnail, stock, code, category, status } = req.body;
    const product = new Product(title, description, price, thumbnail, stock, code, category, status);
    productManager.updateProductById(pid, product);
    res.json(product);
});