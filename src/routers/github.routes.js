import express from 'express';
import passport from 'passport';
import { setup } from 'swagger-ui-express';

// Extends the express.Router class to define Github session router as a subclass
export default class GithubRouter extends express.Router {
  constructor() {
    super();
    this.setup();
  }

  // Method sets up the routes when instantiated
  setup = () => {
    this.get('/failed', [], (req, res) => {
      res.render('error', { error: 'something went wrong' });
    });
    this.get(
      '/login',
      [passport.authenticate('github', { scope: ['user:email'] })],
      (req, res) => {
        res.redirect('/');
      }
    );
    this.get(
      '/callback',
      [
        passport.authenticate('github', {
          failureRedirect: '/api/github/failed',
        }),
      ],
      (req, res) => {
        res.redirect('/');
      }
    );
  };
}
