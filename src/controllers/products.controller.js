import CustomError from '../utils/CustomError.js';

export default class ProductController {
    constructor({ ProductService }) {
        this.productService = ProductService;
    }

    getProducts = async (req, res, next) => {
        try {
            const { limit, sort, page, category } = req.query;
            const options = {
                limit: limit ? Number(limit) : 10,
                page: page ? Number(page) : 1,
                ...(sort && { sort: { price: sort } }),
                ...(category && { category }),
                lean: true,
            };

            let query = {};
            if (category) query = { category: category };

            const paginatedData = await this.productService.getProducts(
                query,
                options
            );

            if (paginatedData) {
                res.status(200).json({
                    success: true,
                    data: paginatedData.docs,
                });
            } else {
                throw new CustomError('NOT_FOUND', 'Products not found.');
            }
        } catch (error) {
            next(error);
        }
    };

    getProduct = async (req, res, next) => {
        try {
            const { productID } = req.params;
            const product = await this.productService.getProduct(productID);

            if (product) {
                res.status(200).json({
                    success: true,
                    data: product,
                });
            } else {
                throw new CustomError('NOT_FOUND', 'Product not found.');
            }
        } catch (error) {
            next(error);
        }
    };

    createProduct = async (req, res, next) => {
        try {
            const product = req.body;
            const newProduct = await this.productService.createProduct(product);

            res.status(201).json({
                success: true,
                message: `Product created successfully. New product's ID is ${newProduct._id}.`,
                data: newProduct,
            });
        } catch (error) {
            next(error);
        }
    };

    updateProduct = async (req, res, next) => {
        try {
            const { productID } = req.params;
            const product = req.body;
            const updatedProduct = await this.productService.updateProduct(
                productID,
                product
            );
            res.status(200).json({
                success: true,
                message: `Product (ID = ${productID}) updated successfully.`,
                data: updatedProduct,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteProduct = async (req, res, next) => {
        try {
            const { productID } = req.params;
            await this.productService.deleteProduct(productID);
            res.status(200).json({
                success: true,
                message: `Product (ID = ${productID}) deleted successfully.`,
            });
        } catch (error) {
            next(error);
        }
    };
}
