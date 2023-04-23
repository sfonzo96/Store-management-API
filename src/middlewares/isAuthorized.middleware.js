import ProductService from '../services/products.db.service.js';
import CustomError from '../utils/CustomError.js';

const isAuthorized = (permission) => async (req, res, next) => {
  try {
    let user;
    if (req.headers.user) {
      req.user = JSON.parse(req.headers.user);
    }

    user = req.user;

    if (!user) {
      throw new CustomError('UNAUTHORIZED', 'Unauthorized');
    }

    if (user.role === 'admin') {
      return next();
    }

    if (user.role === 'premium' || permission === 'createProduct') {
      return next();
    }

    if (user.role === 'premium' && permission === 'deleteProduct') {
      const { productID } = req.params;
      const product = await ProductService.getProduct(productID);

      if (product.owner !== user._id) {
        throw new CustomError('FORBIDDEN', 'Forbidden');
      }

      return next();
    }

    if (
      user.role === 'user' &&
      (permission === 'sendMessage' ||
        permission === 'addToCart' ||
        permission === 'deleteFromCart' ||
        permission === 'makePurchase')
    ) {
      return next();
    }

    throw new CustomError('FORBIDDEN', 'Forbidden');
  } catch (error) {
    next(error);
  }
};

export default isAuthorized;
