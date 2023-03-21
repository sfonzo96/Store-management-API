import express from 'express';
import checkPermission from '../middlewares/authorizate.middleware.js';

export default class ProductsRouter extends express.Router {
    constructor({ ProductController }) {
        super();
        this.get('/', [], ProductController.getProducts);
        this.get('/:productID', [], ProductController.getProduct);
        this.post(
            '/',
            [checkPermission('createProduct')],
            ProductController.createProduct
        );
        this.put(
            '/:productID',
            [checkPermission('updateProduct')],
            ProductController.updateProduct
        );
        this.delete(
            '/:productID',
            [checkPermission('deleteProduct')],
            ProductController.deleteProduct
        );
    }
}
