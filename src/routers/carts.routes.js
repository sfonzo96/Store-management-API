import express from 'express';
import isAuthorized from '../middlewares/isAuthorized.middleware.js';

export default class CartsRouter extends express.Router {
  constructor({ CartController }) {
    super();
    this.cartController = CartController;
    this.setup();
  }

  setup = () => {
    this.post('/', [], this.cartController.createCart);
    this.put('/:cartID/', [], this.cartController.updateCart);
    this.delete('/:cartID', [], this.cartController.deleteCart);
    this.put(
      '/:cartID/product/:productID',
      [],
      this.cartController.updateQuantity
    );
    this.post(
      '/:cartID/product/:productID',
      [isAuthorized('addToCart')],
      this.cartController.addProductToCart
    );
    this.delete(
      '/:cartID/product/:productID',
      [isAuthorized('deleteFromCart')],
      this.cartController.deleteProductFromCart
    );
    this.get('/getCartID', [], this.cartController.getCartID);
    this.post(
      '/:cartID/purchase',
      [isAuthorized('makePurchase')],
      this.cartController.makePurchase
    );
  };
}
