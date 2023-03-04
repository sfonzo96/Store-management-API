import CartModel from "../models/carts.model.js.js.js";

class CartServices {
    async createCart() {
        try {
            const newCart = await CartModel.create({new: true});

            return newCart;
            /* const fullData = cartData; // cartData is the request body
            if (fullData.products.length > 0) { // Sets total for each product and subtotal for the cart
                fullData.products.forEach(products => {
                    products.total = Number(products.price * products.quantity).toFixed(2);
                });
                fullData.subtotal = Number(fullData.products.map(product => product.price * product.quantity).reduce((acc, curr) => acc + curr)).toFixed(2);
            }
            const newCart = await CartModel.create(cartData);
            return newCart; */
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async getCart(cartID) {
        try {
            const cart = await CartModel.findOne({_id: cartID}).lean();
            return cart;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCart(cartID) {
        try {
            await CartModel.findByIdAndUpdate(cartID, {$set: {products: []}});
/*             await CartModel.findByIdAndDelete(cartID).lean(); */
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProductToCart(cartID, productID, quantity) {
        try {
            const cart = await CartModel.findById(cartID); // get cart from db POPULATED WITH MIDDLEWARE (SO INFO IS AVAILABLE!!)
          
            if (!cart) {
                throw new Error("Cart not found");
            }
           
            const productIsInCart = cart.products.some(prod => prod.product.equals(productID)); // check if product is already in cart
            let updatedCart = {};
            if (productIsInCart) { // product is in cart?
                const cart = await CartModel.findOneAndUpdate(
                    { _id: cartID, 'products.product': productID },
                    { $inc: {'products.$.quantity': quantity} },
                    { new: true }
                ).lean()
                updatedCart = {...cart};
            } else {
                const cart = await CartModel.findOneAndUpdate(
                    { _id: cartID },
                    { $push: {products: {product: productID, quantity}} },
                    { new: true }
                ).lean()
                updatedCart = {...cart};
            }

            return updatedCart;

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProductFromCart(cartID, productID) {
        try {
            const cart = await CartModel.findById(cartID);

            if (!cart) {
                throw new Error("Cart not found");
            }

            const productIsInCart = cart.products.some(prod => prod.product.equals(productID));

            if (productIsInCart) {
                const updatedCart = await CartModel.findOneAndUpdate(
                    {_id: cartID, 'products.product': productID },
                    { $pull: {products: {product: productID}} },
                    { new: true } 
                )

                return updatedCart;
            } else throw new Error("Product not found in cart");     
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateCart(cartID, cartData) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(cartID, { products: cartData }, { new: true });
            return updatedCart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateQuantity(cartID, productID, quantity) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartID,
                { $set: {'products.$[elem].quantity': quantity } },
                { arrayFilters: [{ 'elem.product': productID }], new: true }
            )
            return cart                
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const cartsServices = new CartServices();
export default cartsServices;

