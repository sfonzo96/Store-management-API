import express from 'express';
import isAuthenticated from '../middlewares/auth.middleware.js';

export default class UsersRouter extends express.Router {
    constructor({ UserController }) {
        super();
        this.post('/', [], UserController.createUser);
        this.get('/:email', [isAuthenticated], UserController.getUser);
        //TODO Update user endpoints with password update and so
    }
}
