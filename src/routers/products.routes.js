import express from 'express';
// Extends the express.Router class to define products router as a subclass
export default class ProductsRouter extends express.Router {
  constructor({ ProductController, Authorizator }) {
    super();
    this.productController = ProductController;
    this.authorizator = Authorizator;
    this.setup();
  }

  setup = () => {
    this.get('/', [], this.productController.getProducts);
    this.post(
      '/',
      // Verifies user is logged in and has premium role
      [
        (req, res, next) =>
          this.authorizator.authorizatePremium('createProduct')(req, res, next),
      ],
      this.productController.createProduct
    );
    this.get('/:productID', [], this.productController.getProduct);
    this.put(
      '/:productID',
      // Verifies user is logged in and has premium role
      [
        (req, res, next) =>
          this.authorizator.authorizatePremium('updateProduct')(req, res, next),
      ],
      this.productController.updateProduct
    );
    this.delete(
      '/:productID',
      // Verifies user is logged in and has premium role
      [
        (req, res, next) =>
          this.authorizator.authorizatePremium('deleteProduct')(req, res, next),
      ],
      this.productController.deleteProduct
    );
  };
}
