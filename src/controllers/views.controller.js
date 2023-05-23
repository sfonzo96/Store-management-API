import fullUserDTO_res from '../dto/fullUserDTO.res.js';
import CustomError from '../utils/CustomError.js';
export default class ViewController {
  constructor({ ProductService, UserService }) {
    this.productService = ProductService;
    this.userService = UserService;
  }

  // Redirects after successful login
  login = (req, res, next) => {
    try {
      // Checks if the user is authenticated before redirecting
      // If it's not, will return to login page
      if (!req.isAuthenticated()) {
        return res.status(200).render('login');
      }

      // If it is, then will be redirected to products page
      return res.status(200).redirect('/products');
    } catch (error) {
      next(error);
    }
  };

  // Redirects after successful signup
  registerUser = async (req, res, next) => {
    try {
      res.status(200).render('signUp');
    } catch (error) {
      next(error);
    }
  };

  // Gets products from the database and renders their page with their data
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

      const user = req.user;

      if (paginatedData) {
        res.status(200).render('products', { ...paginatedData, user });
      } else {
        throw new CustomError('NOT_FOUND', 'Products not found.');
      }
    } catch (error) {
      next(error);
    }
  };

  // Gets the cart and renders it's page with the data
  getCart = async (req, res, next) => {
    try {
      const userMail = req.user.email;
      const user = await this.userService.getUser(userMail);
      const userDTO = new fullUserDTO_res(user);

      if (userDTO) {
        res.status(200).render('cart', { user: userDTO });
      } else {
        throw new CustomError('NOT_FOUND', 'Cart not found.');
      }
    } catch (error) {
      next(error);
    }
  };

  // Gets the current user and renders the chat page with the data
  getChat = async (req, res, next) => {
    try {
      const user = req.user;

      res.status(200).render('chat', { user });
    } catch (error) {
      next(error);
    }
  };

  // Gets the current user and renders the user center page with the data
  getUserCenter = async (req, res, next) => {
    try {
      const user = req.user;

      res.status(200).render('userCenter', { user });
    } catch (error) {
      next(error);
    }
  };

  // Gets the current user and renders the admin center page with the data
  getAdminCenter = async (req, res, next) => {
    try {
      const user = req.user;

      // Checks for admin role
      if (user.role !== 'admin') {
        throw new CustomError('FORBIDDEN', 'Access denied.');
      }

      res.status(200).render('admin', { user });
    } catch (error) {
      next(error);
    }
  };

  // Gets the productID from the query and renders the update product page with the data
  getUpdateProduct = async (req, res, next) => {
    try {
      // Gets the productID of the product to be updated
      const productID = req.query.productIDPut;

      // Gets the product from the database
      const product = await this.productService.getProduct(productID);

      // Gets the current user
      const user = req.user;

      // checks for admin role
      if (user.role !== 'admin') {
        throw new CustomError('FORBIDDEN', 'Access denied.');
      }

      // If the product exists, renders the update product page with the data
      if (product) {
        return res
          .status(200)
          .render('updateProduct', { ...product, productID, user });
      }

      res.status(404).json({ Error: 'Product not found' });
    } catch (error) {
      next(error);
    }
  };

  // Not used but can be used to render the error page
  getError = async (req, res, next) => {
    try {
      res.status(200).render('error', { error: 'Error' });
    } catch (error) {
      next(error);
    }
  };

  // Renders the forgot password page
  getResetPassword = async (req, res, next) => {
    try {
      res.status(200).render('resetPassword');
    } catch (error) {
      next(error);
    }
  };

  // Renders the reset password success page
  getResetPasswordSuccess = async (req, res, next) => {
    try {
      res.status(200).render('resetPasswordSuccess');
    } catch (error) {
      next(error);
    }
  };

  // Renders the reset password failed page
  getResetPasswordFailed = async (req, res, next) => {
    try {
      res.status(200).render('resetPasswordFailed');
    } catch (error) {
      next(error);
    }
  };
}
