import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
// Extends the express.Router class to define payments router as a subclass
export default class PaymentsRouter extends express.Router {
  constructor({ PaymentController, Authorizator }) {
    super();
    this.authorizator = Authorizator;
    this.paymentController = PaymentController;
    this.setup();
  }

  setup = () => {
    this.post(
      '/:cartID/purchase/',
      // Verifies user is logged in
      [
        isAuthenticated,
        /* (req, res, next) =>
          this.authorizator.authorizateRegularUser(req, res, next), */
      ],
      this.paymentController.makePurchase
    );
  };
}
