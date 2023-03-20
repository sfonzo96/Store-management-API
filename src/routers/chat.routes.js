import express from 'express';
import checkPermission from '../middlewares/authorizate.middleware.js';

export default class ChatRouter extends express.Router {
    constructor({ ChatController }) {
        super();
        this.chatController = ChatController;
        this.setup();
    }

    setup = () => {
        this.post(
            '/new',
            [checkPermission('sendMessage')],
            this.chatController.createMessage
        );
        this.get('/load', [], this.chatController.getMessages);
    };
}
