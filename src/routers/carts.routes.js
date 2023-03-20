import express from 'express';
import checkPermission from '../middlewares/authorizate.middleware.js';

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
            [checkPermission('addToCart')],
            CartController.addProductToCart
        );
        this.delete('/:cartID', [], CartController.deleteCart);
        this.delete(
            '/:cartID/product/:productID',
            [checkPermission('deleteFromCart')],
            CartController.deleteProductFromCart
        );
        this.get('/getCartID', [], CartController.getCartID);
        this.post(
            '/:cartID/purchase',
            [checkPermission('makePurchase')],
            CartController.makePurchase
        );
    }
}
