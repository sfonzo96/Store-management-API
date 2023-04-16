import express from 'express';

export default class MockingRouter extends express.Router {
  constructor({ MockingController }) {
    super();
    this.mockingController = MockingController;
    this.setup();
  }

  setup = () => {
    this.get('/', this.mockingController.getFakeProducts);
  };
}
