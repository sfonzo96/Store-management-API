import express from 'express';
import passport from 'passport';

// Extends the express.Router class to define passport router as a subclass
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
      // Validates user request to sign up
      [
        passport.authenticate('signup', {
          failureRedirect: '/failed',
        }),
      ],
      this.passportController.signUp
    );
    this.post(
      '/login',
      // Validates user request to log in
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
