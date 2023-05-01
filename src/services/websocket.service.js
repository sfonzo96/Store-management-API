import dotenv from 'dotenv';
import logger from '../logger/index.logger.js';
dotenv.config();

export default class WebSocketService {
  constructor({ ChatService }) {
    this.chatService = ChatService;
  }

  websocketInit = (io) => {
    this.io = io;

    this.io.on('connect', async (socket) => {
      logger.info(`Nueva conexion desde el id: ${socket.id}`);

      socket.emit('welcome', {
        welcome: 'Bienvenido al servidor',
        messages: await this.chatService.getMessages(),
      });

      socket.on('disconnect', () => {
        logger.info(`Cierre de conexion`);
      });

      socket.on('newMessage', async (data) => {
        try {
          const newMessage = await this.chatService.createMessage(data);
          this.io.emit('newMessage', newMessage);
        } catch (error) {
          throw error;
        }
      });

      socket.on('newUser', (data) => {
        socket.broadcast.emit('newUser', data);
      });
    });
  };
}
