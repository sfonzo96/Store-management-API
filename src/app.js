import express from 'express';
import handlebars from 'express-handlebars';
import { paginationUrl, compare } from './utils/helpers.js';
import { Server } from 'socket.io';
import cookie from 'cookie-parser';
import session from 'express-session';
import passportConfig from './config/passport.config.js';
import passport from 'passport';
import mongoStore from 'connect-mongo';
import errorHandler from './middlewares/errorHandler.middleware.js';
import loggerMiddleware from './middlewares/logger.middleware.js';
import logger from './logger/index.logger.js';
import setSwaggerDocs from './utils/swagger.js';

export default class AppServer {
  constructor({ ServerConfig, Router, WebsocketService }) {
    this.app = express();
    this.config = ServerConfig;
    this.router = Router;
    this.websocketService = WebsocketService;
    this.setup();
  }

  async setup() {
    // Set swagger
    setSwaggerDocs(this.app, this.config.PORT);

    // Set static route
    this.app.use(express.static('src/public'));

    // Set cookie parser, session and passport
    await passportConfig(passport);
    this.app.use(cookie());
    this.app.use(
      session({
        store: new mongoStore({
          mongoUrl: this.config.MONGO_URI,
          options: {
            userNewUrlParser: true,
            useUnifiedTopology: true,
          },
        }),
        secret: this.config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 10000000 },
      })
    );

    // set passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Set main router
    this.app.use(this.router);

    // Set error handler
    this.app.use(errorHandler);

    // Set logger middleware
    this.app.use(loggerMiddleware);

    // Set template engine
    const hbs = handlebars.create({
      helpers: {
        paginationUrl,
        compare,
      },
    });
    this.app.engine('handlebars', hbs.engine);
    this.app.set('view engine', 'handlebars');
    this.app.set('views', 'src/views');
  }

  start() {
    const server = this.app.listen(this.config.PORT, () => {
      logger.info(`🚀 Server started on port: ${this.config.PORT}`);
    });

    server.on('error', (err) => logger.error('Error:', err));

    const io = new Server(server);
    this.websocketService.websocketInit(io);
  }
}
