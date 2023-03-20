import CartDTO from '../dto/cartDTO.js';

export default class CartService {
    constructor({ CartRepository, PurchaseService }) {
        this.dao = CartRepository;
        this.purchaseService = PurchaseService;
    }

    createCart = async () => {
        try {
            const cart = await this.dao.create();
            return new CartDTO(cart);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getCart = async (cartID) => {
        try {
            const cart = await this.dao.getById(cartID);
            return new CartDTO(cart);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    async deleteCart(cartID) {
        try {
            return await this.dao.delete();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // MEMO: probar --> unificar updateCart y updateQuantity

    async updateCart(cartID, cartData) {
        try {
            const updatedCart = await this.dao.update(
                { _id: cartID },
                { products: cartData }, // alternative { $set: { 'products': cartData } } ? set se emplea por default
                { new: true }
            );
            return new CartDTO(updatedCart);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateQuantity(cartID, productID, quantity) {
        try {
            const updatedCart = await this.dao.update(
                { _id: cartID },
                { $set: { 'products.$[elem].quantity': quantity } },
                { arrayFilters: [{ 'elem.product': productID }], new: true }
            );
            return new CartDTO(updatedCart);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    addProductToCart = async (cartID, productID, quantity) => {
        try {
            const cart = await this.dao.getById(cartID);

            if (!cart) {
                throw new Error('Cart not found');
            }

            const productIsInCart = cart.products.some((prod) =>
                prod.product._id.equals(productID)
            ); // check if product is already in cart

            let updatedCart;

            if (productIsInCart) {
                // product is in cart?
                updatedCart = await this.dao.update(
                    {
                        _id: cartID,
                        products: { $elemMatch: { product: productID } },
                    },
                    { $inc: { 'products.$.quantity': quantity } }
                );
            } else {
                updatedCart = await this.dao.update(
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
            throw new Error(error.message);
        }
    };

    deleteProductFromCart = async (cartID, productID) => {
        try {
            const cart = await this.dao.getById(cartID);

            if (!cart) {
                throw new Error('Cart not found');
            }

            const productIsInCart = cart.products.some((prod) =>
                prod.product._id.equals(productID)
            );

            if (productIsInCart) {
                const updatedCart = await this.dao.update(
                    {
                        _id: cartID,
                        products: { $elemMatch: { product: productID } },
                    },
                    { $pull: { products: { product: productID } } },
                    { new: true }
                );

                return new CartDTO(updatedCart);
            } else throw new Error('Product not found in cart');
        } catch (error) {
            throw new Error(error.message);
        }
    };
}
