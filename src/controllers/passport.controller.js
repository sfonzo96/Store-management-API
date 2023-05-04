import logger from '../logger/index.logger.js';

export default class PassportController {
  // TODO: implement a notification on authentication (frontend)
  constructor({ UserService }) {
    this.userService = UserService;
  }

  fail = async (req, res) => {
    logger.warn('Failed login');
    res.redirect('error', { error: 'Failed login' });
  };

  signUp = async (req, res) => {
    res.status(201).redirect('/products');
  };

  login = async (req, res) => {
    const { id } = req.user;
    await this.userService.refreshLastConnection(id);

    res.status(200).redirect('/products');
  };

  logout = async (req, res, next) => {
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
