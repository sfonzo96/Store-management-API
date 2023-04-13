import express from 'express';
import isAuthorized from '../middlewares/isAuthorized.middleware.js';

export default class CartsRouter extends express.Router {
    constructor({ CartController }) {
        super();
        this.post('/', [], CartController.createCart);
        this.put('/:cartID/', [], CartController.updateCart);
        this.put(
            '/:cartID/product/:productID',
            [],
            CartController.updateQuantity
        );
        this.post(
            '/:cartID/product/:productID',
            [isAuthorized('addToCart')],
            CartController.addProductToCart
        );
        this.delete('/:cartID', [], CartController.deleteCart);
        this.delete(
            '/:cartID/product/:productID',
            [isAuthorized('deleteFromCart')],
            CartController.deleteProductFromCart
        );
        this.get('/getCartID', [], CartController.getCartID);
        this.post(
            '/:cartID/purchase',
            [isAuthorized('makePurchase')],
            CartController.makePurchase
        );
    }
}
