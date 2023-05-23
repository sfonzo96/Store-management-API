import CustomError from '../utils/CustomError.js';
import checkDocs from '../utils/checkDocs.js';

export default class Authorizator {
  constructor({ ProductService }) {
    this.productService = ProductService;
  }

  // Authorizates only admin
  authorizateAdmin = async (req, res, next) => {
    try {
      // Gets user from req (session)
      const user = await this.getUser(req);

      // Checks for admin role
      if (user.role === 'admin') {
        return next();
      }
    } catch (error) {
      next(error);
    }
  };

  // Authorizates premium users, and admin
  authorizatePremium = (action) => {
    return async (req, res, next) => {
      try {
        // Gets user from req (session)
        const user = await this.getUser(req);

        // Checks for admin role
        if (user.role === 'admin') {
          return next();
        }

        // Checks for premium role
        if (user.role === 'premium') {
          // Allows product creation if user is premium
          if (action === 'createProduct') {
            return next();
          }

          // Allows product update and delete if user is premium only if he/she owns the product
          if (action === 'updateProduct' || action === 'deleteProduct') {
            const { productID } = req.params;
            const product = await ProductService.getProduct(productID);

            // Checks product ownership to be different from user
            if (product.owner !== user._id) {
              throw new CustomError('FORBIDDEN', 'Forbidden');
            }

            return next();
          }

          // Allows user to change role to user
          if (action === 'changeRole') {
            const { toRole } = req.query;
            // Allows to change back to common user
            if (toRole === 'user') {
              return next();
            }

            // Allows to change to premium if user has uploaded docs
            const isAllowed = await checkDocs(user);

            if (isAllowed) {
              return next();
            }
          }
        }

        throw new CustomError('FORBIDDEN', 'Forbidden');
      } catch (error) {
        next(error);
      }
    };
  };

  // Authorizates regular users (checks if user is logged in) (similar to isAuthenticated middleware)
  authorizateRegularUser = async (req, res, next) => {
    try {
      const user = await this.getUser(req);
      if (
        user.role === 'user' ||
        user.role === 'premium' ||
        user.role === 'admin'
      ) {
        return next();
      }

      throw new CustomError('FORBIDDEN', 'Forbidden');
    } catch (error) {
      next(error);
    }
  };

  // Gets the current user from req (session)
  getUser = async (req) => {
    try {
      if (req.headers.user) {
        // only for testing purposes
        req.user = JSON.parse(req.headers.user);
      }

      if (!req.user) {
        throw new CustomError('UNAUTHORIZED', 'Unauthorized');
      }

      return req.user;
    } catch (error) {
      next(error);
    }
  };
}
