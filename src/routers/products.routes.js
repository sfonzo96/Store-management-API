import express from 'express';
import isAuthorized from '../middlewares/isAuthorized.middleware.js';

export default class ProductsRouter extends express.Router {
    constructor({ ProductController }) {
        super();
        this.get('/', [], ProductController.getProducts);
        this.get('/:productID', [], ProductController.getProduct);
        this.post(
            '/',
            [isAuthorized('createProduct')],
            ProductController.createProduct
        );
        this.put(
            '/:productID',
            [isAuthorized('updateProduct')],
            ProductController.updateProduct
        );
        this.delete(
            '/:productID',
            [isAuthorized('deleteProduct')],
            ProductController.deleteProduct
        );
    }
}
