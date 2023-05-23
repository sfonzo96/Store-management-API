import CustomError from '../utils/CustomError.js';
import mailing from '../utils/mailing.js';

export default class PurchaseService {
  constructor({
    ProductRepository,
    CartRepository,
    UserRepository,
    PurchaseRepository,
  }) {
    this.productsDao = ProductRepository;
    this.cartsDao = CartRepository;
    this.usersDao = UserRepository;
    this.purchaseDao = PurchaseRepository;
  }

  // Checks if the products in the cart are available in the desired amount
  checkStock = async (cartID) => {
    try {
      // Gets the cart
      const cart = await this.cartsDao.getOne({ _id: cartID });

      const availableProducts = [];
      const unavailableProducts = [];

      // Iterates over the cart's products
      for (const prod of cart.products) {
        const product = await this.productsDao.getOne({
          _id: prod.product,
        });

        // If the itetration's product's stock is less than the desired quantity, it's added to the unavailable products array
        if (product.stock < prod.quantity) {
          unavailableProducts.push(prod);
        } else {
          // If product's stock is greater than the desired quantity, it's added to the available products array
          this.reduceStock(product._id, prod.quantity);
          availableProducts.push(prod);
        }
      }

      return { availableProducts, unavailableProducts };
    } catch (error) {
      throw error;
    }
  };

  // Reduces the stock of a product once the purchase is made
  reduceStock = async (productID, quantity) => {
    try {
      // Gets a product
      const product = await this.productsDao.getOne({ _id: productID });
      // Reduces the stock
      product.stock -= quantity;
      // Updates the product stock quantity
      await this.productsDao.update(
        { _id: product._id },
        { stock: product.stock }
      );
    } catch (error) {
      throw error;
    }
  };

  // Makes a purchase
  makePurchase = async (cartID, userMail) => {
    try {
      // Checks if the products in the cart are available in the desired amount
      const { availableProducts, unavailableProducts } = await this.checkStock(
        cartID
      );
      // Gets the user
      const user = await this.usersDao.getOne({ email: userMail });

      // If there are no available products, the purchase is not made
      if (availableProducts.length === 0) {
        return null;
      }

      // If there's enough stock, calculates the subtotal of the purchase
      const subtotal = availableProducts.reduce((accumulator, current) => {
        return accumulator + current.product.price * current.quantity;
      }, 0);

      // Creates the purchase
      const purchase = await this.purchaseDao.create({
        purchaser: user.email,
        products: availableProducts,
        subtotal: subtotal,
      });

      // Updates the cart with the unavailable products (i.e. makes a partial purchase)
      await this.cartsDao.update(
        { _id: cartID },
        { products: unavailableProducts }
      );

      // Could be useful to notify the user about the partial purchase before proceeding with the partial purchase

      // Sends the purchase notification to the store owner
      mailing.sendNotificateSell(purchase._id);

      // Sends the purchase notification to the purchaser
      mailing.sendPurchaseMail(user, purchase);

      return purchase;
    } catch (error) {
      throw error;
    }
  };

  // Gets a purchase by its ID
  getPurchaseById = async (id) => {
    try {
      const purchase = await this.purchaseDao.getOne({ _id: id });

      if (!purchase) {
        throw new CustomError('NOT_FOUND', 'Purchase not found');
      }

      return purchase;
    } catch (error) {
      throw error;
    }
  };

  // Changes the purchase status to true if payment is successful
  setPurchaseStatus = async (id, status) => {
    try {
      // Gets the purchase
      const purchase = await this.purchaseDao.getOne({ _id: id });

      // Verifies that the purchase has been registered previously
      if (!purchase) {
        throw new CustomError('NOT_FOUND', 'Purchase not found');
      }

      // If registered, then updates it's status
      await this.purchaseDao.update({ _id: id }, { status: status });
    } catch (error) {
      throw error;
    }
  };
}
