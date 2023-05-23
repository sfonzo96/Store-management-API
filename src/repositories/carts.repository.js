import BaseRepository from './base.repository.js';

// Extends BaseRepository class for cart's operations
export default class CartsRepository extends BaseRepository {
  constructor({ Cart }) {
    super(Cart);
  }

  // Overrides method from BaseRepository in order to implement soft delete / empty cart
  delete = async (cartID) => {
    // Soft delete:
    const emptyCart = await this.model.findByIdAndUpdate(cartID, {
      $set: { products: [] },
    });
    // If hard delete is desired: await this.model.findByIdAndDelete(cartID).lean();

    return emptyCart;
  };
}
