import bcrypt from 'bcrypt';
import fullUserDTO_res from '../dto/fullUserDTO.res.js';
import CustomError from '../utils/CustomError.js';

export default class AuthService {
  constructor({ UserService }) {
    this.userService = UserService;
  }

  login = async (email, password) => {
    try {
      const user = await this.userService.getUser(email);

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

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
