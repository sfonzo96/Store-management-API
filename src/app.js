import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import './config/db.js'
import router from './routers/index.router.js'
import { create } from 'express-handlebars';
import {paginationUrl} from './utils/helpers.js';
import { Server } from 'socket.io';
import webSocketService from './services/websocket.services.js';

const hbs = create({
    helpers: {
        paginationUrl,
    }
});

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

app.use(router);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`)
})
server.on('error', (err) => console.log(err));

const io = new Server(server);
webSocketService.websocketInit(io);
