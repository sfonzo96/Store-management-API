import express from 'express';
import passport from 'passport';

export default class PassportRouter extends express.Router {
  constructor({ PassportController }) {
    super();
    this.passportController = PassportController;
    this.setup();
  }

  setup = () => {
    this.get('/failed', this.passportController.fail);
    this.post(
      '/signup',
      [
        passport.authenticate('signup', {
          failureRedirect: '/failed',
        }),
      ],
      this.passportController.signUp
    );
    this.post(
      '/login',
      [
        passport.authenticate('login', {
          failureRedirect: '/failed',
        }),
      ],
      this.passportController.login
    );
    this.post('/logout', [], this.passportController.logout);
  };
}
