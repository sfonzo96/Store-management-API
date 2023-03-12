export default class CartDTO {
    constructor(cart) {
        this.id = cart._id || cart.id;
        this.products = cart.products;
    }
}
