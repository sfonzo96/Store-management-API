//TODO: implementar repositorio para purchase
import CustomError from '../utils/CustomError.js';
import mailing from '../utils/mailing.js';

export default class PurchaseService {
  constructor({
    ProductRepository,
    CartRepository,
    UserRepository,
    PurchaseTicket,
    //PurchaseRepository,
  }) {
    this.productsDao = ProductRepository;
    this.cartsDao = CartRepository;
    this.usersDao = UserRepository;
    this.purchaseTicket = PurchaseTicket;
    //this.purchaseDao = PurchaseRepository;
  }

  //
  checkStock = async (cartID) => {
    try {
      const cart = await this.cartsDao.getOne({ _id: cartID });

      const availableProducts = [];
      const unavailableProducts = [];

      for (const prod of cart.products) {
        const product = await this.productsDao.getOne({
          _id: prod.product,
        });
        if (product.stock < prod.quantity) {
          unavailableProducts.push(prod);
        } else {
          this.reduceStock(product._id, prod.quantity);
          availableProducts.push(prod);
        }
      }

      return { availableProducts, unavailableProducts };
    } catch (error) {
      throw error;
    }
  };

  reduceStock = async (productID, quantity) => {
    try {
      const product = await this.productsDao.getOne({ _id: productID });
      product.stock -= quantity;
      await this.productsDao.update(
        { _id: product._id },
        { stock: product.stock }
      );
    } catch (error) {
      throw error;
    }
  };

  makePurchase = async (cartID, userMail) => {
    try {
      const { availableProducts, unavailableProducts } = await this.checkStock(
        cartID
      );
      const user = await this.usersDao.getOne({ email: userMail });

      // TODO: modify format of purchase to only have productID, title, quantity and price (see cart model: cartItemSchema)
      if (availableProducts.length === 0) {
        return null;
      }

      console.log(availableProducts);

      const subtotal = availableProducts.reduce((accumulator, current) => {
        return accumulator + current.product.price * current.quantity;
      }, 0);

      const purchase = await this.purchaseTicket.create({
        purchaser: user.email,
        products: availableProducts,
        subtotal: subtotal,
      });

      console.log(purchase);

      await this.cartsDao.update(
        { _id: cartID },
        { products: unavailableProducts }
      );

      mailing.sendNotificateSell(purchase._id);
      mailing.sendPurchaseMail(user, purchase);
      // TODO: check case parcial purchase (how to tell the user?)
      return purchase;
    } catch (error) {
      throw error;
    }
  };

  getPurchaseById = async (id) => {
    try {
      const purchase = await this.purchaseTicket.findOne({ _id: id }).lean();

      if (!purchase) {
        throw new CustomError('NOT_FOUND', 'Purchase not found');
      }

      return purchase;
    } catch (error) {
      throw error;
    }
  };

  setPurchaseStatus = async (id, status) => {
    try {
      const purchase = await this.purchaseTicket.findOne({ _id: id }).lean();

      if (!purchase) {
        throw new CustomError('NOT_FOUND', 'Purchase not found');
      }

      await this.purchaseTicket
        .updateOne({ _id: id }, { status: status })
        .lean();
    } catch (error) {
      throw error;
    }
  };
}
