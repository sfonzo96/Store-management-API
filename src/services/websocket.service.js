import dotenv from 'dotenv';
import logger from '../logger/index.logger.js';
dotenv.config();

export default class WebSocketService {
  constructor({ ChatService }) {
    this.chatService = ChatService;
  }
  websocketInit = (io) => {
    // TODO implement middleware to check for user permission to send messages
    this.io = io;

    this.io.on('connection', async (socket) => {
      logger.info(`Nueva conexion desde el id: ${socket.id}`);

      socket.emit('welcome', {
        welcome: 'Bienvenido al servidor',
        messages: await this.chatService.getMessages(),
      });

      socket.on('disconnect', (socket) => {
        logger.info(`Cierre de conexion`);
      });

      socket.on('newUser', (data) => {
        socket.broadcast.emit('newUser', data);
      });
    });
  };
}
