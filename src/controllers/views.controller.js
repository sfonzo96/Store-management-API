import UserDTO from '../dto/userDTO.js';
import CustomError from '../utils/CustomError.js';
export default class ViewController {
  constructor({ ProductService, UserService }) {
    this.productService = ProductService;
    this.userService = UserService;
    // TODO: integrate other controllers instead of services and avoid repeating the functions??
  }

  login = (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(200).render('login');
      }

      return res.status(200).redirect('/products');
    } catch (error) {
      next(error);
    }
  };

  registerUser = async (req, res, next) => {
    try {
      res.status(200).render('signUp');
    } catch (error) {
      next(error);
    }
  };

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

  getCart = async (req, res, next) => {
    try {
      const userMail = req.user.email;
      const user = await this.userService.getUser(userMail);
      const userDTO = new UserDTO(user);

      if (userDTO) {
        res.status(200).render('cart', { user: userDTO });
      } else {
        throw new CustomError('NOT_FOUND', 'Cart not found.');
      }
    } catch (error) {
      next(error);
    }
  };

  getChat = async (req, res, next) => {
    try {
      const user = req.user;

      res.status(200).render('chat', { user });
    } catch (error) {
      next(error);
    }
  };

  getUserCenter = async (req, res, next) => {
    try {
      const user = req.user;

      res.status(200).render('userCenter', { user });
    } catch (error) {
      next(error);
    }
  };

  getAdminCenter = async (req, res, next) => {
    try {
      const user = req.user;

      if (user.role !== 'admin') {
        throw new CustomError('FORBIDDEN', 'Access denied.');
      }

      res.status(200).render('admin', { user });
    } catch (error) {
      next(error);
    }
  };

  getUpdateProduct = async (req, res, next) => {
    try {
      const productID = req.query.productIDPut;

      const product = await this.productService.getProduct(productID);

      const user = req.user;

      if (user.role !== 'admin') {
        throw new CustomError('FORBIDDEN', 'Access denied.');
      }

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

  getError = async (req, res, next) => {
    try {
      res.status(200).render('error', { error: 'Error' });
    } catch (error) {
      next(error);
    }
  };

  getResetPassword = async (req, res, next) => {
    try {
      res.status(200).render('resetPassword');
    } catch (error) {
      next(error);
    }
  };

  getResetPasswordSuccess = async (req, res, next) => {
    try {
      res.status(200).render('resetPasswordSuccess');
    } catch (error) {
      next(error);
    }
  };

  getResetPasswordFailed = async (req, res, next) => {
    try {
      res.status(200).render('resetPasswordFailed');
    } catch (error) {
      next(error);
    }
  };
}
