import express from 'express';

export default class IndexRouter extends express.Router {
    constructor({
        ProductsRouter,
        CartsRouter,
        UsersRouter,
        ViewsRouter,
        PassportRouter,
        GithubRouter,
    }) {
        super();

        // Set router for each path
        this.use('/api/products', ProductsRouter);
        this.use('/api/carts', CartsRouter);
        this.use('/api/users', UsersRouter);
        this.use('/', ViewsRouter);
        this.use('/api/passport', PassportRouter);
        this.use('/api/github', GithubRouter);
    }
}
