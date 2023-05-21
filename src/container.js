// awilix utils
import { createContainer, asClass, asValue, InjectionMode } from 'awilix';

// utils and middlewares
import Authorizator from './middlewares/authorizator.middleware.js';
import StripePayment from './utils/stripePayment.js';

//TODO: set auto-load (check https://github.com/jeffijoe/awilix#auto-loading-modules)
// config
import ServerConfig from './config/server.config.js';
// server
import App from './app.js';
// router
import Router from './routers/index.routes.js';
import ProductsRouter from './routers/products.routes.js';
import CartsRouter from './routers/carts.routes.js';
import ViewsRouter from './routers/views.routes.js';
import UsersRouter from './routers/users.routes.js';
import PassportRouter from './routers/passport.routes.js';
import GithubRouter from './routers/github.routes.js';
import ChatRouter from './routers/chat.routes.js';
import MockingRouter from './routers/mocking.routes.js';
import PaymentsRouter from './routers/payments.routes.js';
// models
import User from './models/users.model.js';
import Product from './models/products.model.js';
import Cart from './models/carts.model.js';
import Message from './models/message.model.js';
import PurchaseTicket from './models/purchaseTicket.model.js';
// repositories
import UserRepository from './repositories/users.repository.js';
import ProductRepository from './repositories/products.repository.js';
import CartRepository from './repositories/carts.repository.js';
// services
import UserService from './services/users.db.service.js';
import ProductService from './services/products.db.service.js';
import CartService from './services/carts.db.service.js';
import AuthService from './services/auth.service.js';
import WebsocketService from './services/websocket.service.js';
import ChatService from './services/chat.db.service.js';
import PurchaseService from './services/purchase.db.service.js';
import PaymentService from './services/payments.service.js';
// controllers
import UserController from './controllers/users.controller.js';
import ProductController from './controllers/products.controller.js';
import CartController from './controllers/carts.controller.js';
import ViewController from './controllers/views.controller.js';
import PassportController from './controllers/passport.controller.js';
import ChatController from './controllers/chat.controller.js';
import MockingController from './controllers/mocking.controller.js';
import PaymentController from './controllers/payments.controller.js';

// create container
const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

// register all dependencies
container.register({
  // Models
  User: asValue(User),
  Product: asValue(Product),
  Cart: asValue(Cart),
  Message: asValue(Message),
  PurchaseTicket: asValue(PurchaseTicket),

  // Repositories
  UserRepository: asClass(UserRepository).singleton(),
  ProductRepository: asClass(ProductRepository).singleton(),
  CartRepository: asClass(CartRepository).singleton(),

  // Services
  ChatService: asClass(ChatService).singleton(),
  WebsocketService: asClass(WebsocketService).singleton(),
  UserService: asClass(UserService).singleton(),
  ProductService: asClass(ProductService).singleton(),
  CartService: asClass(CartService).singleton(),
  AuthService: asClass(AuthService).singleton(),
  PurchaseService: asClass(PurchaseService).singleton(),
  PaymentService: asClass(PaymentService).singleton(),

  // Controllers
  UserController: asClass(UserController).singleton(),
  ProductController: asClass(ProductController).singleton(),
  CartController: asClass(CartController).singleton(),
  ViewController: asClass(ViewController).singleton(),
  PassportController: asClass(PassportController).singleton(),
  ChatController: asClass(ChatController).singleton(),
  MockingController: asClass(MockingController).singleton(),
  PaymentController: asClass(PaymentController).singleton(),

  // Utility classes and middlewares
  Authorizator: asClass(Authorizator).singleton(),
  StripePayment: asClass(StripePayment).singleton(),

  // Routers
  ProductsRouter: asClass(ProductsRouter).singleton(),
  CartsRouter: asClass(CartsRouter).singleton(),
  ViewsRouter: asClass(ViewsRouter).singleton(),
  UsersRouter: asClass(UsersRouter).singleton(),
  PassportRouter: asClass(PassportRouter).singleton(),
  GithubRouter: asClass(GithubRouter).singleton(),
  ChatRouter: asClass(ChatRouter).singleton(),
  MockingRouter: asClass(MockingRouter).singleton(),
  PaymentsRouter: asClass(PaymentsRouter).singleton(),
  Router: asClass(Router).singleton(),

  // Config
  ServerConfig: asValue(ServerConfig),

  // Server
  App: asClass(App).singleton(),
});

export default container;
