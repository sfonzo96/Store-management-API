import express from 'express';
import isAuthorized from '../middlewares/isAuthorized.middleware.js';

export default class ChatRouter extends express.Router {
  constructor({ ChatController }) {
    super();
    this.chatController = ChatController;
    this.setup();
  }

  setup = () => {
    /*     this.post(
      '/new',
      [isAuthorized('sendMessage')],
      this.chatController.createMessage
    ); */
    this.get('/load', [], this.chatController.getMessages);
  };
}
