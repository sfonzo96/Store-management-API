import express from 'express';
import isAuthorized from '../middlewares/isAuthorized.middleware.js';

export default class ProductsRouter extends express.Router {
  constructor({ ProductController }) {
    super();
    this.productController = ProductController;
    this.setup();
  }

  setup = () => {
    this.get('/', [], this.productController.getProducts);
    this.post(
      '/',
      [isAuthorized('createProduct')],
      this.productController.createProduct
    );
    this.get('/:productID', [], this.productController.getProduct);
    this.put(
      '/:productID',
      [isAuthorized('updateProduct')],
      this.productController.updateProduct
    );
    this.delete(
      '/:productID',
      [isAuthorized('deleteProduct')],
      this.productController.deleteProduct
    );
  };
}
