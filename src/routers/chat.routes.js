import express from 'express';
export default class ChatRouter extends express.Router {
  constructor({ ChatController /* Authorizator */ }) {
    super();
    this.chatController = ChatController;
    // this.authorizator = Authorizator;
    this.setup();
  }

  setup = () => {
    /*     this.post(
      '/new',
      [this.authorizator.authorizateRegularUser()],
      this.chatController.createMessage
    ); */
    this.get('/load', [], this.chatController.getMessages);
  };
}
