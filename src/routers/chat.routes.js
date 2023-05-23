import express from 'express';
// Extends the express.Router class to define chat router
export default class ChatRouter extends express.Router {
  constructor({ ChatController }) {
    super();
    this.chatController = ChatController;
    this.setup();
  }

  // Method sets up the routes when instantiated
  setup = () => {
    this.get('/load', [], this.chatController.getMessages);
  };
}
