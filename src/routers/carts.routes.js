import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';

// Extends the express.Router class to define carts router as a subclass
export default class CartsRouter extends express.Router {
  constructor({ CartController, Authorizator }) {
    super();
    this.cartController = CartController;
    this.authorizator = Authorizator;
    this.setup();
  }

  // Method sets up the routes when instantiated
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
      // Verifies user is logged in, other alternative is left commented
      [
        isAuthenticated,
        /* (req, res, next) =>
          this.authorizator.authorizateRegularUser(req, res, next), */
      ],
      this.cartController.addProductToCart
    );
    this.delete(
      '/:cartID/product/:productID',
      // Verifies user is logged in, other alternative is left commented
      [
        isAuthenticated,
        /* (req, res, next) =>
          this.authorizator.authorizateRegularUser(req, res, next), */
      ],
      this.cartController.deleteProductFromCart
    );
    this.get('/getCartID', [], this.cartController.getCartID);
  };
}
