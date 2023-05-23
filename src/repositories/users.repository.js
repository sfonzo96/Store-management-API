import BaseRepository from './base.repository.js';

// Extends the BaseRepository class for user's operations
export default class UserRepository extends BaseRepository {
  constructor({ User }) {
    super(User);
  }
}
