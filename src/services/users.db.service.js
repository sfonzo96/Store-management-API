import bcrypt from 'bcrypt';
import simpleUserDTO_res from '../dto/simpleUserDTO.res.js';
import fullUserDTO_res from '../dto/fullUserDTO.res.js';
import CustomError from '../utils/CustomError.js';
import mailing from '../utils/mailing.js';

// Defines the user service class
export default class UserService {
  constructor({ UserRepository, CartRepository }) {
    this.usersDao = UserRepository;
    this.cartsDao = CartRepository;
  }

  // Creates a new user
  createUser = async (user) => {
    try {
      // Checks if the user already exists
      const userExists = await this.usersDao.getOne({
        email: user.email,
      });

      if (userExists) {
        throw new CustomError('CONFLICT', 'User already exists');
      }

      // Proceeds to create a new cart if the user doesn't exist
      const newCart = await this.cartsDao.create();

      // Hashes the password
      user.password = await bcrypt.hash(user.password, 10);

      // Creates the user
      const createdUser = await this.usersDao.create({
        ...user,
        cart: newCart.id,
      });

      // Could add a mailing service here in order to notify successful registration
      return new fullUserDTO_res(createdUser);
    } catch (error) {
      throw error;
    }
  };

  // Gets a list of users
  getUsers = async () => {
    try {
      // Gets users from db
      const userList = await this.usersDao.getMany();

      // if there are no users, returns null
      if (userList.length < 1) {
        return null;
      }

      // Maps the users to a simple user dto in order to adjust to just what's required
      const simpleUsersList = userList.map(
        (user) => new simpleUserDTO_res(user)
      );

      return simpleUsersList;
    } catch (error) {
      throw error;
    }
  };

  // Gets a single user by it's email
  getUser = async (email) => {
    try {
      // Gets the user from db
      const user = await this.usersDao.getOne({ email });

      if (!user) {
        return null;
      }

      return user; // sends plain user, with hashed password, in order to compare password in AuthService (password will be deleted when returning to client, check controller)
    } catch (error) {
      throw error;
    }
  };

  // Gets a single user by id
  getUserById = async (id) => {
    try {
      // Gets the user from db
      const user = await this.usersDao.getById(id);

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      return new fullUserDTO_res(user);
    } catch (error) {
      throw error;
    }
  };

  // Updates a user password
  resetPassword = async (email, newPassword) => {
    try {
      // Gets the user
      const user = await this.usersDao.getOne({ email });

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      // Checks if the new password is the same as the old one
      const isSamePassword = await bcrypt.compare(newPassword, user.password);

      // If it is, throws an error
      if (isSamePassword) {
        throw new CustomError(
          'CONFLICT',
          'New password must be different from the old one.'
        );
      }

      // Hashes the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Updates the user password
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

  // Updates a user's last connection date (stays as an active)
  refreshLastConnection = async (id) => {
    try {
      // Updates the user's last connection date
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

  // Updates a user's role
  changeRole = async (id, toRole) => {
    try {
      // Update
      const user = await this.usersDao.update({ _id: id }, { role: toRole });

      // If the user doesn't exist, throws an error
      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      return new fullUserDTO_res(user);
    } catch (error) {
      throw error;
    }
  };

  // Adds a document to the user profile
  addDocument = async (id, file) => {
    try {
      // Defines the document object
      const document = {
        name: file.fieldname,
        reference: file.path,
      };

      // Gets the user
      let user = await this.usersDao.getById(id);

      // Checks if the user already has a document of the same kind
      if (user.documents.some((doc) => doc.name === document.name)) {
        throw new CustomError('CONFLICT', 'Document already exists');
      } else {
        // Adds the document to the user
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

  // Deletes users that are not active i.e. more than 2 days since last connection
  deleteInactiveUsers = async () => {
    try {
      // Gets current Date
      const currentDate = new Date();
      const twoDaysAgo = new Date(
        currentDate.getTime() - 2 * 24 * 60 * 60 * 1000 // Calculates the date 2 days ago in ms
      );
      const nonActiveCriteria = {
        lastConnection: { $lt: twoDaysAgo }, // Sets the criteria to delete users that have not connected in the last 2 days, i.e users whose lastConnection date in ms is less than 2 days ago date
      };

      // Gets the list of inactive users
      const inactiveUsers = await this.usersDao.getMany(nonActiveCriteria);

      // loops over the list and sends mails to  each user
      await inactiveUsers.forEach(async (user) => {
        await mailing.sendDeletionNotice(user);
      });

      // Deletes the users that are inactive
      this.usersDao.deleteMany(nonActiveCriteria);

      return true;
    } catch (error) {
      throw error;
    }
  };
}
