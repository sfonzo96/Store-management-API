import CustomError from '../utils/CustomError.js';
import mailing from '../utils/mailing.js';
import verifyJwt from '../utils/verifyJwt.js';

export default class UserController {
  constructor({ UserService }) {
    this.userService = UserService;
  }

  // Creastes a new user
  createUser = async (req, res, next) => {
    try {
      // Creates a new user with the request's body's data
      const user = await this.userService.createUser(req.body);

      if (!user) {
        throw new CustomError('SERVER_ERROR', 'Error creating user');
      }

      res.status(201).redirect('/');
    } catch (error) {
      next(error);
    }
  };

  // Gets all users
  getUsers = async (req, res, next) => {
    try {
      const userList = await this.userService.getUsers();

      if (userList.length < 1) {
        throw new CustomError('NOT_FOUND', 'No users found');
      }

      res.status(200).json({
        success: true,
        userList,
      });
    } catch (error) {
      next(error);
    }
  };

  // Gets a single user by its email
  getUser = async (req, res, next) => {
    try {
      const { email } = req.params;

      const user = await this.userService.getUser(email);

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Sends a password reset email to the user
  sendPwResetEmail = async (req, res, next) => {
    try {
      const { email } = req.body;

      // gets the user by its email
      const user = await this.userService.getUser(email);

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      // Sends the email to the user
      const res = await mailing.sendPwResetEmail(user);

      if (!res) {
        throw new CustomError('SERVER_ERROR', 'Error on sending email');
      }

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  // Verifies the password reset token
  verifyPasswordResetToken = async (req, res, next) => {
    try {
      const { token } = req.params;

      // Verification
      const isValid = await verifyJwt(token);

      if (!isValid) {
        return res.status(401).redirect('password/reset/failed');
      }

      res.status(200).redirect('password/reset');
    } catch (error) {
      next(error);
    }
  };

  // Resets the user's password
  resetPassword = async (req, res, next) => {
    try {
      // When token is valid the email and new password comes in the request's body
      const { email, newPassword } = req.body;

      // Updates the password to the user related to that email
      const res = await this.userService.resetPassword(email, newPassword);

      if (!res) {
        throw new CustomError('CONFLICT', 'Password reset failed');
      }

      res.status(200).redirect('password/reset/success');
    } catch (error) {
      next(error);
    }
  };

  // Gets the current user from session
  getCurrentUser = async (req, res, next) => {
    try {
      const { email } = req.user;

      // Gets the user by its email
      const user = await this.userService.getUser(email);

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      delete user.password;

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Changes a user's role
  changeRole = async (req, res, next) => {
    try {
      const { userID, toRole } = req.query;

      // Changes the role to a new one
      const user = await this.userService.changeRole(userID, toRole);

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Handles uploaded file (to "uploads" folder)
  addDocument = async (req, res, next) => {
    try {
      const { userID } = req.params;
      const { file } = req;

      // Adds the document to the user register and stores it in folder
      const success = await this.userService.addDocument(userID, file);

      if (!success) {
        throw new CustomError('SERVER_ERROR', 'Error adding document');
      }

      res.status(200).redirect('/usercenter');
    } catch (error) {
      next(error);
    }
  };

  // Deletes a user
  deleteInactiveUsers = async (req, res, next) => {
    try {
      // Deletes inactive users (more than 2 days off)
      const deleted = await this.userService.deleteInactiveUsers();

      if (!deleted) {
        throw new CustomError('SERVER_ERROR', 'Error deleting users');
      }
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
