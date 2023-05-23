import BaseRepository from './base.repository.js';

// Extends the BaseRepository class for product's operations
export default class ProductsRepository extends BaseRepository {
  constructor({ Product }) {
    super(Product);
  }

  // Define a pagination method
  getManyPaginated = async (query, options) => {
    return await this.model.paginate(query, options);
  };
}
