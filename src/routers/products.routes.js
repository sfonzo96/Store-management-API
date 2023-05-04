import express from 'express';
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
      [
        (req, res, next) =>
          this.authorizator.authorizatePremium('createProduct')(req, res, next),
      ],
      this.productController.createProduct
    );
    this.get('/:productID', [], this.productController.getProduct);
    this.put(
      '/:productID',
      [
        (req, res, next) =>
          this.authorizator.authorizatePremium('updateProduct')(req, res, next),
      ],
      this.productController.updateProduct
    );
    this.delete(
      '/:productID',
      [
        (req, res, next) =>
          this.authorizator.authorizatePremium('deleteProduct')(req, res, next),
      ],
      this.productController.deleteProduct
    );
  };
}
