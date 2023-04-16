import express from 'express';
import passport from 'passport';
import { setup } from 'swagger-ui-express';

export default class GithubRouter extends express.Router {
  constructor() {
    super();
    this.setup();
  }

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
