import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

export default class IndexRouter extends express.Router {
  constructor({
    ProductsRouter,
    CartsRouter,
    UsersRouter,
    ViewsRouter,
    PassportRouter,
    GithubRouter,
    ChatRouter,
    MockingRouter,
  }) {
    super();
    this.productsRouter = ProductsRouter;
    this.cartsRouter = CartsRouter;
    this.usersRouter = UsersRouter;
    this.viewsRouter = ViewsRouter;
    this.passportRouter = PassportRouter;
    this.githubRouter = GithubRouter;
    this.chatRouter = ChatRouter;
    this.mockingRouter = MockingRouter;
    this.setup();
  }

  setup = () => {
    // Set other mids
    this.use(express.json());
    this.use(express.urlencoded({ extended: true }));
    this.use(cors());
    // this.use(helmet()); needs to be configured to allow axios and other front end scripts

    // Set router for each path
    this.use('/api/products', this.productsRouter);
    this.use('/api/carts', this.cartsRouter);
    this.use('/api/users', this.usersRouter);
    this.use('/', this.viewsRouter);
    this.use('/api/passport', this.passportRouter);
    this.use('/api/github', this.githubRouter);
    this.use('/api/chat', this.chatRouter);
    this.use('/api/mocking', this.mockingRouter);
  };
}
