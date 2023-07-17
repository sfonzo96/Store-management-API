import express from 'express';
import cors from 'cors';

// Main router, extends from express.Router and sets up all the other routers on instantiation
// Also sets some configurations and mids for the server
export default class IndexRouter extends express.Router {
  constructor({
    ProductsRouter,
    CartsRouter,
    UsersRouter,
    ViewsRouter,
    PassportRouter,
    GithubRouter,
    ChatRouter,
    // MockingRouter,
    PaymentsRouter,
  }) {
    super();
    this.productsRouter = ProductsRouter;
    this.cartsRouter = CartsRouter;
    this.usersRouter = UsersRouter;
    this.viewsRouter = ViewsRouter;
    this.passportRouter = PassportRouter;
    this.githubRouter = GithubRouter;
    this.chatRouter = ChatRouter;
    // this.mockingRouter = MockingRouter;
    this.paymentsRouter = PaymentsRouter;
    this.setup();
  }

  setup = () => {
    // Set other mids
    this.use(express.json());
    this.use(express.urlencoded({ extended: true }));
    this.use(cors());

    // Set router for each path
    this.use('/api/products', this.productsRouter);
    this.use('/api/carts', this.cartsRouter);
    this.use('/api/users', this.usersRouter);
    this.use('/', this.viewsRouter);
    this.use('/api/passport', this.passportRouter);
    this.use('/api/github', this.githubRouter);
    this.use('/api/chat', this.chatRouter);
    // this.use('/api/mocking', this.mockingRouter);
    this.use('/api/payments', this.paymentsRouter);
  };
}
