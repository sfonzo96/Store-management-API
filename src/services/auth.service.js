import bcrypt from 'bcrypt';
import fullUserDTO_res from '../dto/fullUserDTO.res.js';
import CustomError from '../utils/CustomError.js';

// Defines the AuthService class for login authentication
export default class AuthService {
  constructor({ UserService }) {
    this.userService = UserService;
  }

  // Logins a user
  login = async (email, password) => {
    try {
      // Gets user from db by it's email
      const user = await this.userService.getUser(email);

      // Checks if user exists
      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      // Compares passwords
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new CustomError('INVALID_CREDENTIALS', 'Wrong password');
      }

      return new fullUserDTO_res(user);
    } catch (error) {
      next(error);
    }
  };
}
