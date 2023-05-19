import bcrypt from 'bcrypt';
import simpleUserDTO_res from '../dto/simpleUserDTO.res.js';
import fullUserDTO_res from '../dto/fullUserDTO.res.js';
import CustomError from '../utils/CustomError.js';
import mailing from '../utils/mailing.js';

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
        cart: newCart.id,
      });

      return new fullUserDTO_res(createdUser);
    } catch (error) {
      throw error;
    }
  };

  getUsers = async () => {
    try {
      const userList = await this.usersDao.getMany();

      if (userList.length < 1) {
        return false;
      }

      const simpleUsersList = userList.map(
        (user) => new simpleUserDTO_res(user)
      );

      return simpleUsersList;
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

      return new fullUserDTO_res(user);
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

      return new fullUserDTO_res(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  // make a generic update method

  refreshLastConnection = async (id) => {
    try {
      const user = await this.usersDao.update(
        { _id: id },
        { lastConnection: Date.now() }
      );

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      return new fullUserDTO_res(user);
    } catch (error) {
      throw error;
    }
  };

  changeRole = async (id, toRole) => {
    try {
      const user = await this.usersDao.update({ _id: id }, { role: toRole });

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      return new fullUserDTO_res(user);
    } catch (error) {
      throw error;
    }
  };

  addDocument = async (id, file) => {
    try {
      const document = {
        name: file.fieldname,
        reference: file.path,
      };

      let user = await this.usersDao.getById(id);

      if (user.documents.some((doc) => doc.name === document.name)) {
        throw new CustomError('CONFLICT', 'Document already exists');
      } else {
        user = await this.usersDao.update(
          { _id: id, 'documents.document.name': { $ne: document.name } },
          { $addToSet: { documents: document } }
        );
      }

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      return new fullUserDTO_res(user);
    } catch (error) {
      throw error;
    }
  };

  deleteInactiveUsers = async () => {
    try {
      const currentDate = new Date(); // Gets current Date
      const twoDaysAgo = new Date(
        currentDate.getTime() - 2 * 24 * 60 * 60 * 1000
      ); // Calculates the date 2 days ago in ms
      const nonActiveCriteria = {
        lastConnection: { $lt: twoDaysAgo }, // Sets the criteria to delete users that have not connected in the last 2 days, i.e users whose lastConnection date in ms is less than 2 days ago date
      };

      const inactiveUsers = await this.usersDao.getMany(nonActiveCriteria); // Gets the list of inactive users

      // loops over the list and sends mails to  each user
      await inactiveUsers.forEach(async (user) => {
        await mailing.sendDeletionNotice(user);
      });

      this.usersDao.deleteMany(nonActiveCriteria); // Deletes users that have not connected in the last 2 days

      return true;
    } catch (error) {
      throw error;
    }
  };
}
