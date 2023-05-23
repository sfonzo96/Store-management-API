import CustomError from '../utils/CustomError.js';

export default class ProductController {
  constructor({ ProductService }) {
    this.productService = ProductService;
  }

  // Gets all products with pagination, admits a limit per page, a sort and a category filter
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

      // Gets paginated data from db
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

  // Gets a single product by its ID
  getProduct = async (req, res, next) => {
    try {
      const { productID } = req.params;

      // Gets the product from db
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

  // Creates a new product
  createProduct = async (req, res, next) => {
    try {
      const product = req.body;

      if (req.user.id) {
        // This wil validate that the req.user obj has an id (testing's user won't have it) and define an owner if it has (admin or premium user will have it)
        const owner = {
          ownerId: req.user.id,
          ownerEmail: req.user.email,
        };
        Object.assign(product, { owner });
      }

      // Creates the product
      const newProduct = await this.productService.createProduct(product);

      if (!newProduct) {
        throw new CustomError('BAD_REQUEST', "Product couldn't be created.");
      }

      res.status(201).json({
        success: true,
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

      // Updates the product with the new data from the request's body
      const updatedProduct = await this.productService.updateProduct(
        productID,
        product
      );

      if (!updatedProduct) {
        throw new CustomError('BAD_REQUEST', "Product couldn't be updated.");
      }

      res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  };

  // Deletes a product by its ID
  deleteProduct = async (req, res, next) => {
    try {
      const { productID } = req.params;

      // Deletes a product from db
      const success = await this.productService.deleteProduct(productID);

      if (!success) {
        throw new CustomError('BAD_REQUEST', "Product couldn't be deleted.");
      }

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
