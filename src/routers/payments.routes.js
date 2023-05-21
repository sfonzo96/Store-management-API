import express from 'express';
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
      [
        (req, res, next) =>
          this.authorizator.authorizateRegularUser(req, res, next),
      ],
      this.paymentController.makePurchase
    );
  };
}
