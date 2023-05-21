import express from 'express';

export default class CartsRouter extends express.Router {
  constructor({ CartController, Authorizator }) {
    super();
    this.cartController = CartController;
    this.authorizator = Authorizator;
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
      [
        (req, res, next) =>
          this.authorizator.authorizateRegularUser(req, res, next),
      ],
      this.cartController.addProductToCart
    );
    this.delete(
      '/:cartID/product/:productID',
      [
        (req, res, next) =>
          this.authorizator.authorizateRegularUser(req, res, next),
      ],
      this.cartController.deleteProductFromCart
    );
    this.get('/getCartID', [], this.cartController.getCartID);
  };
}
