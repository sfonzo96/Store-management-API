import CustomError from '../utils/CustomError.js';
import checkDocs from '../utils/checkDocs.js';

export default class Authorizator {
  constructor({ ProductService }) {
    this.productService = ProductService;
  }

  authorizateAdmin = async (req, res, next) => {
    try {
      const user = await this.getUser(req);

      if (user.role === 'admin') {
        return next();
      }
    } catch (error) {
      next(error);
    }
  };

  authorizatePremium = (action) => {
    return async (req, res, next) => {
      try {
        const user = await this.getUser(req);

        if (user.role === 'admin') {
          return next();
        }

        if (user.role === 'premium') {
          if (action === 'createProduct') {
            return next();
          }

          if (action === 'updateProduct' || action === 'deleteProduct') {
            const { productID } = req.params;
            const product = await ProductService.getProduct(productID);

            if (product.owner !== user._id) {
              throw new CustomError('FORBIDDEN', 'Forbidden');
            }

            return next();
          }

          if (action === 'changeRole') {
            const { toRole } = req.query;
            if (toRole === 'user') {
              return next();
            }

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
