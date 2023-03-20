//TODO: implementar repositorio para purchase

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
            throw new Error(error.message);
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
            throw new Error(error.message);
        }
    };

    makePurchase = async (cartID, userMail) => {
        try {
            const { availableProducts, unavailableProducts } =
                await this.checkStock(cartID);
            const user = await this.userDao.getOne({ email: userMail });

            // TODO: modify format of purchase to only have productID, title, quantity and price (see cart model: cartItemSchema)
            if (availableProducts.length === 0) {
                // throw new Error('No products available for purchase');
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

            // TODO: check case parcial purchase (how to tell the user?)
            return purchase;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}

/* 
+ Chequear stock:
    - Si el producto tiene suficiente stock
    para la cantidad indicada en el
    producto del carrito, entonces
    restarlo del stock del producto y
    continuar.
    // TODO OK pero hay que testear

    - Si el producto no tiene suficiente
    stock para la cantidad indicada en el
    producto del carrito, entonces no
    agregar el producto al proceso de
    compr a
        // TODO OK pero hay que testear
    
+ Al final, utilizar el servicio de Tickets
para poder generar un ticket con los
datos de la compra.

+ En caso de existir una compra no
completada, devolver el arreglo con los
ids de los productos que no pudieron
procesarse

+ Una vez finalizada la compra, el carrito asociado
al usuario que compró deberá contener sólo los
productos que no pudieron comprarse. Es decir,
se filtran los que sí se compraron y se quedan
aquellos que no tenían disponibilidad. 
*/
