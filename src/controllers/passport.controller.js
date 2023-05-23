import logger from '../logger/index.logger.js';

export default class PassportController {
  constructor({ UserService }) {
    this.userService = UserService;
  }

  // Not in use, but can be used to redirect to a custom error page
  fail = async (req, res) => {
    logger.warn('Failed login');
    res.redirect('error', { error: 'Failed login' });
  };

  // Redirects to products page after a successful signup
  signUp = async (req, res) => {
    res.status(201).redirect('/products');
  };

  // Refreshes user last connection and redirects to products page after a successful login
  login = async (req, res) => {
    const { id } = req.user;
    await this.userService.refreshLastConnection(id);

    res.status(200).redirect('/products');
  };

  logout = async (req, res, next) => {
    // Refreshes user last connection and redirects to home page (login) after a successful logout
    try {
      const { id } = req.user;
      await this.userService.refreshLastConnection(id);

      await req.logout(async (err) => {
        if (err) return next(err);

        await req.session.destroy(() =>
          res.status(200).json({ redirectURL: '/' })
        );
      });
    } catch (error) {
      throw error;
    }
  };
}
