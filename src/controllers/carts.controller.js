import CustomError from '../utils/CustomError.js';

export default class CartsController {
  constructor({ CartService, PurchaseService, UserService, ProductService }) {
    this.cartService = CartService;
    this.purchaseService = PurchaseService;
    this.userService = UserService;
    this.productService = ProductService;
  }

  createCart = async (req, res, next) => {
    try {
      // Creates a new cart
      const newCart = await this.cartService.createCart();
      res.status(201).json({
        success: true,
        data: newCart,
      });
    } catch (error) {
      next(error);
    }
  };

  getCart = async (req, res, next) => {
    try {
      // Gets a cart by its ID
      const { cartID } = req.params;
      const cart = await this.cartService.getCart(cartID);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCart = async (req, res, next) => {
    try {
      // Soft deletes a cart by its ID (service function updates to empty cart)
      const { cartID } = req.params;

      const cart = await this.cartService.deleteCart(cartID); // Returns an empty cart

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  };

  addProductToCart = async (req, res, next) => {
    try {
      const { cartID, productID } = req.params;
      const { quantity } = req.body;

      if (quantity <= 0) {
        throw new CustomError(
          'VALIDATION_ERROR',
          'Invalid quantity. Must be a positive integer.'
        );
      }

      // Gets the user by the id stored in session
      const user = await this.userService.getUser(req.user.id);
      // Gets the product by its ID
      const product = await this.productService.getProduct(productID);

      // If the user is premium and the product is owned by the user, throw an error to forbid the auto-buy
      if (user.role === 'premium' && user._id === product.owner) {
        throw new CustomError(
          'FORBIDDEN',
          'Premium users cannot add their own products to the cart.'
        );
      }

      // Adds the product to the cart in the desired amount
      const cart = await this.cartService.addProductToCart(
        cartID,
        productID,
        Number(quantity)
      );

      if (cart) {
        res.status(200).json({
          success: true,
          data: cart,
        });
      } else {
        throw new CustomError('NOT_FOUND', 'Cart not found');
      }
    } catch (error) {
      next(error);
    }
  };

  deleteProductFromCart = async (req, res, next) => {
    try {
      const { cartID, productID } = req.params;

      // Deletes the product from the cart

      const cart = await this.cartService.deleteProductFromCart(
        cartID,
        productID
      );
      if (cart) {
        res.status(200).json({
          success: true,
          data: cart,
        });
      } else {
        throw new CustomError('NOT_FOUND', 'Cart not found');
      }
    } catch (error) {
      next(error);
    }
  };

  updateCart = async (req, res, next) => {
    try {
      const { products } = req.body;
      const { cartID } = req.params;

      // Updates the cart with the new set of products
      const updatedCart = await this.cartService.updateCart(cartID, products);
      if (updatedCart) {
        res.status(200).json({
          success: true,
          data: updatedCart,
        });
      } else {
        throw new CustomError('NOT_FOUND', 'Cart not found');
      }
    } catch (error) {
      next(error);
    }
  };

  updateQuantity = async (req, res, next) => {
    try {
      const { cartID, productID } = req.params;
      const { quantity } = req.body;

      // Updates the quantity of a product in the cart by adding the desired amount to the current
      const updatedCart = await this.cartService.updateQuantity(
        cartID,
        productID,
        Number(quantity)
      );
      if (updatedCart) {
        res.status(200).json({
          success: true,
          data: updatedCart,
        });
      } else {
        throw new CustomError('NOT_FOUND', 'Cart not found');
      }
    } catch (error) {
      next(error);
    }
  };

  getCartID = async (req, res, next) => {
    try {
      // Gets the cart from the session and returns its ID to the client side prior to another related request
      const cartID = req.user.cart._id.toString();

      res.status(200).json({
        success: true,
        cartID,
      });
    } catch (error) {
      next(error);
    }
  };
}
