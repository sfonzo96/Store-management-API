import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import isAuthorized from '../middlewares/isAuthorized.middleware.js';

export default class UsersRouter extends express.Router {
  constructor({ UserController }) {
    super();
    this.userController = UserController;
    this.setup();
  }

  setup = () => {
    this.post('/', [], this.userController.createUser);
    this.get('/:email', [isAuthenticated], this.userController.getUser);
    this.get(
      '/getCurrentUser',
      [isAuthenticated],
      this.userController.getCurrentUser
    );
    this.get('/sendPwResetEmail', [], this.userController.sendPwResetEmail);
    this.get(
      'password/reset/:token',
      [],
      this.userController.verifyPasswordResetToken
    );
    this.post(
      '/password/reset',
      [isAuthenticated],
      this.userController.resetPassword
    );
    this.put(
      '/permission/change/',
      [isAuthorized('changeRole')],
      this.userController.changeRole
    );
  };
}
