import { Router } from "express";
import CartManager from "../CartManager.js";

const cartsRouter = Router();

const cartManager = new CartManager();

cartsRouter.post('/', (req, res) => {
    cartManager.createCart();
})

cartsRouter.get('/:cid', (req, res) => {
    const { cid } = Number(req.params);
    const cart = cartManager.getCartById(cid);
    res.json(cart);
})

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    cartManager.addProductToCart(Number(cid), Number(pid));
})