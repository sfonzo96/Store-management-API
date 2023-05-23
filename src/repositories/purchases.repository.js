import BaseRepository from './base.repository.js';

// Extends the BaseRepository class for purchase's operations
export default class PurchaseRepository extends BaseRepository {
  constructor({ PurchaseTicket }) {
    super(PurchaseTicket);
  }
}
