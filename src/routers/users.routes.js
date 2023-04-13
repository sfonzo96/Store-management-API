import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.middleware.js';
import isAuthorized from '../middlewares/isAuthorized.middleware.js';

export default class UsersRouter extends express.Router {
    constructor({ UserController }) {
        super();
        this.post('/', [], UserController.createUser);
        this.get('/:email', [isAuthenticated], UserController.getUser);
        this.get(
            '/getCurrentUser',
            [isAuthenticated],
            UserController.getCurrentUser
        );
        this.get('/sendPwResetEmail', [], UserController.sendPwResetEmail);
        this.get(
            'password/reset/:token',
            [],
            UserController.verifyPasswordResetToken
        );
        this.post(
            '/password/reset',
            [isAuthenticated],
            UserController.resetPassword
        );
        this.put(
            '/permission/change/',
            [isAuthorized('changeRole')],
            UserController.changeRole
        );
    }
}
