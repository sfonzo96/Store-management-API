//TODO: implementar repositorio para purchase
import mailing from '../utils/mailing.js';

export default class PurchaseService {
    constructor({
        ProductRepository,
        CartRepository,
        UserRepository,
        PurchaseTicket,
        //PurchaseRepository,
    }) {
        this.productDao = ProductRepository;
        this.cartDao = CartRepository;
        this.userDao = UserRepository;
        this.purchaseTicket = PurchaseTicket;
        //this.purchaseDao = PurchaseRepository;
    }

    //
    checkStock = async (cartID) => {
        try {
            const cart = await this.cartDao.getOne({ _id: cartID });

            const availableProducts = [];
            const unavailableProducts = [];

            for (const prod of cart.products) {
                const product = await this.productDao.getOne({
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
            const product = await this.productDao.getOne({ _id: productID });
            product.stock -= quantity;
            await this.productDao.update(
                { _id: product._id },
                { stock: product.stock }
            );
        } catch (error) {
            throw error;
        }
    };

    makePurchase = async (cartID, userMail) => {
        try {
            const { availableProducts, unavailableProducts } =
                await this.checkStock(cartID);
            const user = await this.userDao.getOne({ email: userMail });

            // TODO: modify format of purchase to only have productID, title, quantity and price (see cart model: cartItemSchema)
            if (availableProducts.length === 0) {
                return null;
            }

            const purchase = await this.purchaseTicket.create({
                purchaser: user.email,
                products: availableProducts,
            });

            await this.cartDao.update(
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
}
