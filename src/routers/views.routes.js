import express from 'express';

// Extends the express.Router class to define views router as a subclass
export default class ViewsRouter extends express.Router {
  constructor({ ViewController }) {
    super();
    this.viewController = ViewController;
    this.setup();
  }

  setup = () => {
    this.get('/chat', [], this.viewController.getChat);

    this.get('/', [], this.viewController.login);

    this.get('/cart', [], this.viewController.getCart);

    this.get('/products', [], this.viewController.getProducts);

    this.get('/signup', [], this.viewController.registerUser);

    this.get('/usercenter', [], this.viewController.getUserCenter);

    this.get('/admin', [], this.viewController.getAdminCenter);

    this.get('/admin/update/', [], this.viewController.getUpdateProduct);

    this.get('/failed', [], this.viewController.getError);

    this.get('/password/reset', [], this.viewController.getResetPassword);

    this.get(
      '/password/reset/success',
      [],
      this.viewController.getResetPasswordSuccess
    );

    this.get(
      '/password/reset/failed',
      [],
      this.viewController.getResetPasswordFailed
    );
  };
}
