import CustomError from '../utils/CustomError.js';

export default class CartsController {
    constructor({ CartService, PurchaseService, UserService }) {
        this.cartService = CartService;
        this.purchaseService = PurchaseService;
        this.userService = UserService;
    }

    createCart = async (req, res, next) => {
        try {
            const newCart = await this.cartService.createCart();
            res.status(201).json({
                succees: true,
                message: 'New cart created.',
                cart: newCart,
            });
        } catch (error) {
            next(error);
        }
    };

    getCart = async (req, res, next) => {
        try {
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
            const { cartID } = req.params;
            await this.cartService.deleteCart(cartID); // Returns an empty cart
            res.status(200).json({
                success: true,
                message: `Cart ${cartID} was emptied`,
            });
        } catch (error) {
            next(error);
        }
    };

    addProductToCart = async (req, res, next) => {
        try {
            const { cartID, productID } = req.params;
            const { quantity } = req.body;
            const user = await this.productService.getUser(req.user.id);
            const product = await this.productService.getProduct(productID);

            if (user.role === 'premium' && user._id === product.owner) {
                throw new CustomError(
                    'FORBIDDEN',
                    'Premium users cannot add their own products to the cart.'
                );
            }

            if (quantity <= 0) {
                throw new CustomError(
                    'VALIDATION_ERROR',
                    'Invalid quantity. Must be a positive integer.'
                );
            }

            const cart = await this.cartService.addProductToCart(
                cartID,
                productID,
                Number(quantity)
            );

            if (cart) {
                res.status(200).json({
                    success: true,
                    message: `Product ${productID} added to cart ${cart._id}`,
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

            const cart = await this.cartService.deleteProductFromCart(
                cartID,
                productID
            );
            if (cart) {
                res.status(200).json({
                    success: true,
                    message: `Product ${productID} deleted from cart ${cartID}`,
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
            const updatedCart = await this.cartService.updateCart(
                cartID,
                products
            );
            if (updatedCart) {
                res.status(200).json({
                    success: true,
                    message: `Cart ${cartID} updated.`,
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
            const updatedCart = await this.cartService.updateQuantity(
                cartID,
                productID,
                Number(quantity)
            );
            if (updatedCart) {
                res.status(200).json({
                    success: true,
                    message: `Product ${productID} quantity updated to ${quantity} in cart ${cartID}`,
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
            const cartID = req.user.cart._id.toString();

            res.status(200).json({
                success: true,
                cartID,
            });
        } catch (error) {
            next(error);
        }
    };

    makePurchase = async (req, res, next) => {
        try {
            const { cartID } = req.params;
            const userMail = req.user.email;

            const purchase = await this.purchaseService.makePurchase(
                cartID,
                userMail
            );
            if (purchase) {
                res.status(200).json({
                    success: true,
                    message: `Purchase of cart ${cartID} successful`,
                    data: purchase,
                });
            } else {
                throw new CustomError(
                    'CONFLICT',
                    'Out of stock. Try again later or contact us for updates.'
                );
            }
        } catch (error) {
            next(error);
        }
    };
}
