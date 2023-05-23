import CartDTO from '../dto/cartDTO.res.js';
import CustomError from '../utils/CustomError.js';
import mongoose from 'mongoose';

// Defines the CartService class
export default class CartService {
  constructor({ CartRepository, PurchaseService }) {
    this.cartDao = CartRepository;
    this.purchaseService = PurchaseService;
  }

  // Creates a new cart
  createCart = async () => {
    try {
      const cart = await this.cartDao.create();
      return new CartDTO(cart);
    } catch (error) {
      throw error;
    }
  };

  // Gets a cart by it's ID
  getCart = async (cartID) => {
    try {
      const cart = await this.cartDao.getById(cartID);
      return new CartDTO(cart);
    } catch (error) {
      throw error;
    }
  };

  // Deletes a cart
  deleteCart = async (cartID) => {
    try {
      return await this.cartDao.delete(cartID);
    } catch (error) {
      throw error;
    }
  };

  // Updates a cart
  updateCart = async (cartID, cartData) => {
    try {
      // Updates cart by it's ID with the new set of products
      const updatedCart = await this.cartDao.update(
        { _id: cartID },
        { products: cartData },
        { new: true }
      );
      return new CartDTO(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  // Updates a product's quantity in a specified cart (not implemented in frontend but could be useful)
  updateQuantity = async (cartID, productID, quantity) => {
    try {
      const updatedCart = await this.cartDao.update(
        { _id: cartID },
        { $set: { 'products.$[elem].quantity': quantity } }, // Sets the new quantity
        {
          arrayFilters: [
            { 'elem.product': mongoose.Types.ObjectId(productID) }, // Checks cart for a product that matches the ID
          ],
          new: true,
        }
      );
      return new CartDTO(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  // Adds a product to a cart
  addProductToCart = async (cartID, productID, quantity) => {
    try {
      // Gets cart by it's ID
      const cart = await this.cartDao.getById(cartID);

      if (!cart) {
        throw new CustomError('NOT_FOUND', 'Cart not found');
      }

      // Checks if product exists in cart already
      const productIsInCart = cart.products.some((prod) =>
        prod.product._id.equals(productID)
      );

      let updatedCart;

      if (productIsInCart) {
        // If product exists, updates it's quantity
        updatedCart = await this.cartDao.update(
          {
            _id: cartID,
            products: { $elemMatch: { product: productID } },
          },
          { $inc: { 'products.$.quantity': quantity } } // Increments quantity
        );
      } else {
        // If product doesn't exist, pushes it to cart
        updatedCart = await this.cartDao.update(
          { _id: cartID },
          {
            $push: {
              products: { product: productID, quantity },
            },
          }
        );
      }
      return new CartDTO(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  // Deletes a product from a cart
  deleteProductFromCart = async (cartID, productID) => {
    try {
      // Gets cart by it's ID
      const cart = await this.cartDao.getById(cartID);

      if (!cart) {
        throw new CustomError('NOT_FOUND', 'Cart not found');
      }

      // Checks if product exists in cart
      const productIsInCart = cart.products.some((prod) =>
        prod.product._id.equals(productID)
      );

      if (productIsInCart) {
        const updatedCart = await this.cartDao.update(
          {
            _id: cartID,
            products: { $elemMatch: { product: productID } },
          },
          { $pull: { products: { product: productID } } }, // Pulls product out from cart
          { new: true }
        );

        return new CartDTO(updatedCart);
      } else throw new CustomError('NOT_FOUND', 'Product not found in cart');
    } catch (error) {
      throw error;
    }
  };
}
