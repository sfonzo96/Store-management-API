import { Router } from "express";
import ProductManager from "../productManager.js";
import Product from "../Product.js";

export const productsRouter = Router();

const productManager = new ProductManager();

productsRouter.get('/', (req, res) => {
    try {
        const { limit } = req.query;
        if (!limit) {
            const products = productManager.getProducts();
            res.status(200).json(products);
        } else {
            const productsQuery = productManager.getProducts().slice(0, limit);
            res.status(200).json(productsQuery);
        }
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

productsRouter.post('/', (req, res) => {
    try {
        const { title, description, price, thumbnail, stock, code, category, status } = req.body;
        const product = new Product(title, description, price, thumbnail, stock, code, category, status);
        productManager.addProduct(product);
        res.status(201).json(product);
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
});

productsRouter.get('/:pid', (req, res) => {
    try {
        const { pid } = req.params;
        const product = productManager.getProductById(pid);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }

})

productsRouter.put('/:pid', (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, price, thumbnail, stock, code, category, status } = req.body;
        const product = new Product(title, description, price, thumbnail, stock, code, category, status);
        productManager.updateProductById(Number(pid), product);
        res.status(200).json(product);
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
});