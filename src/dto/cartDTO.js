export default class CartDTO {
    constructor(cart) {
        this.id = cart._id || cart.id;
        this.products = cart.products;
        this.subtotal;
        this.setSubtotal();
    }

    setSubtotal = () => {
        let subtotal = 0;
        this.products.forEach((product) => {
            subtotal += product.product.price * product.quantity;
        });
        this.subtotal = subtotal;
    };
}
