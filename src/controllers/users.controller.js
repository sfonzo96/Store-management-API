import CustomError from '../utils/CustomError.js';
import mailing from '../utils/mailing.js';
import verifyJwt from '../utils/verifyJwt.js';

export default class UserController {
  constructor({ UserService }) {
    this.userService = UserService;
  }

  createUser = async (req, res, next) => {
    try {
      const user = await this.userService.createUser(req.body);
      if (!user) {
        throw new CustomError('SERVER_ERROR', 'Error creating user');
      }
      delete user.password;
      res.status(201).redirect('/');
    } catch (error) {
      next(error);
    }
  };

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

  sendPwResetEmail = async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await this.userService.getUser(email);

      if (!user) {
        throw new CustomError('NOT_FOUND', 'User not found');
      }

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

  //TODO: verify token should be generic
  verifyPasswordResetToken = async (req, res, next) => {
    try {
      const { token } = req.params;

      const isValid = await verifyJwt(token);

      if (!isValid) {
        return res.status(401).redirect('password/reset/failed');
      }

      res.status(200).redirect('password/reset');
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;

      const res = await this.userService.resetPassword(email, newPassword);

      if (!res) {
        throw new CustomError('CONFLICT', 'Password reset failed');
      }

      res.status(200).redirect('password/reset/success');
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (req, res, next) => {
    try {
      const { email } = req.user;

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

  changeRole = async (req, res, next) => {
    try {
      const { userID, toRole } = req.query;
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

  addDocument = async (req, res, next) => {
    try {
      const { userID } = req.params;
      const { file } = req;
      const success = await this.userService.addDocument(userID, file);

      if (!success) {
        throw new CustomError('SERVER_ERROR', 'Error adding document');
      }

      res.status(200).redirect('/usercenter');
    } catch (error) {
      next(error);
    }
  };
}
