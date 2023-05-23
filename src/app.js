import express from 'express';
import handlebars from 'express-handlebars';
import { paginationUrl, compare, docsIncludes } from './utils/helpers.js';
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

// App server class and server configuration
export default class AppServer {
  constructor({ ServerConfig, Router, WebsocketService }) {
    this.app = express();
    this.config = ServerConfig;
    this.router = Router;
    this.websocketService = WebsocketService;
    this.setup();
  }

  async setup() {
    // Sets swagger
    setSwaggerDocs(this.app, this.config.PORT);

    // Sets static route
    this.app.use(express.static('src/public'));

    // Sets cookie parser, session and passport
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

    // Sets passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Sets main router
    this.app.use(this.router);

    // Sets error handler
    this.app.use(errorHandler);

    // Sets logger middleware
    this.app.use(loggerMiddleware);

    // Sets template engine
    const hbs = handlebars.create({
      // Defines handlebars helper
      helpers: {
        paginationUrl,
        compare,
        docsIncludes,
      },
    });
    this.app.engine('handlebars', hbs.engine);
    this.app.set('view engine', 'handlebars');
    this.app.set('views', 'src/views');
  }

  // Starts the server
  start() {
    const server = this.app.listen(this.config.PORT, () => {
      logger.info(`🚀 Server started on port: ${this.config.PORT}`);
    });

    server.on('error', (err) => logger.error('Error:', err));

    // Sets websocket
    const io = new Server(server);
    this.websocketService.websocketInit(io);
  }
}
