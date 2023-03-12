import CartDTO from './DTO.js';
// VER BIEN PATRÓN REPOSITORY
export class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async create(data) {
        const cart = await this.dao.create(data);
        const cartDTO = new CartDTO(cart);
        return cartDTO;
    }

    async getOne(id) {
        const cart = await this.dao.getOne(id);
        const cartDTO = new CartDTO(cart);
        return cartDTO;
    }

    async getMany() {
        const carts = await this.dao.getMany();
        const cartDTO = carts.map((carts) => new CartDTO(carts));
        return cartDTO;
    }
    async update(id, data) {
        const cart = await this.dao.update(id, data);
        const cartDTO = new CartDTO(cart);
        return cartDTO;
    }
    async delete(id) {
        const cart = await this.dao.delete(id);
        const cartDTO = new CartDTO(cart);
        return cartDTO;
    }
}
