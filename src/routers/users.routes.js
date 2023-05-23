import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import upload from '../middlewares/uploadUserDocs.middleware.js';

// Extends the express.Router class to define users router as a subclass
export default class UsersRouter extends express.Router {
  constructor({ UserController, Authorizator }) {
    super();
    this.userController = UserController;
    this.authorizator = Authorizator;
    this.setup();
  }

  setup = () => {
    this.get('/', [], this.userController.getUsers);
    this.post('/', [], this.userController.createUser);
    this.delete('/', [], this.userController.deleteInactiveUsers);
    this.get('/:email', [isAuthenticated], this.userController.getUser);
    this.get(
      '/getCurrentUser',
      // Verifies user is logged in
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
      // Verifies user is logged in
      [isAuthenticated],
      this.userController.resetPassword
    );
    // This is for role changing, new role is passed in as a query as well as the user id
    this.put(
      '/permission/change/',
      // Verifies user is logged in and has premium role
      [this.authorizator.authorizatePremium('changeRole')],
      this.userController.changeRole
    );
    this.post(
      '/:userID/documents/:type',
      [upload],
      this.userController.addDocument
    );
  };
}
