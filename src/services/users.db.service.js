import bcrypt from 'bcrypt';
import UserDTO from '../dto/userDTO.js';
import CustomError from '../utils/CustomError.js';

export default class UserService {
  constructor({ UserRepository, CartRepository }) {
    this.usersDao = UserRepository;
    this.cartsDao = CartRepository;
  }

  createUser = async (user) => {
    try {
      const userExists = await this.usersDao.getOne({
        email: user.email,
      });

      if (userExists) {
        throw new CustomError('CONFLICT', 'User already exists');
      }

      const newCart = await this.cartsDao.create();

      user.password = await bcrypt.hash(user.password, 10);

      const createdUser = await this.usersDao.create({
        ...user,
        cart: newCart._id,
      });

      return new UserDTO(createdUser);
    } catch (error) {
      throw error;
    }
  };

  // TODO: combine with getUserById. Inconvenient with destructuring in the criteria (email is ok, id is not since it's _id in db) (needs aditional logic to make it propper)
  getUser = async (email) => {
    try {
      const user = await this.usersDao.getOne({ email });

      if (!user) {
        return false;
      }

      return user; // sends plain user in order to compare password in AuthService
    } catch (error) {
      throw error;
    }
  };

  getUserById = async (id) => {
    try {
      const user = await this.usersDao.getById(id);

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      return new UserDTO(user);
    } catch (error) {
      throw error;
    }
  };

  resetPassword = async (email, newPassword) => {
    try {
      const user = await this.usersDao.getOne({ email });

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);

      if (isSamePassword) {
        throw new CustomError(
          'CONFLICT',
          'New password must be different from the old one.'
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await this.usersDao.update(
        { _id: user._id },
        {
          password: hashedPassword,
        }
      );

      return new UserDTO(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  changeRole = async (id, toRole) => {
    const user = await this.usersDao.update({ _id: id }, { role: toRole });

    if (!user) {
      throw new CustomError('NOT_FOUND', 'User not found');
    }

    return new UserDTO(user);
  };
}
