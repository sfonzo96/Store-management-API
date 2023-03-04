import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import './config/db.config.js'
import router from './routers/index.routes.js'
import { create } from 'express-handlebars';
import {paginationUrl, compare} from './utils/helpers.js';
import { Server } from 'socket.io';
import webSocketService from './services/websocket.services.js';
import cookie from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import configPassport from './config/passport.config.js';
import passport from 'passport';
import mongoStore from "connect-mongo";

const hbs = create({
    helpers: {
        paginationUrl,
        compare
    }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));
app.use(cookie());
app.use(
  session({
    store: new mongoStore({
      mongoUrl: process.env.MONGO_URI,
      options: {
        userNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10000000 },
  }),
);
configPassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(router);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'src/views');


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`)
})
server.on('error', (err) => console.log(err));

const io = new Server(server);
webSocketService.websocketInit(io);
