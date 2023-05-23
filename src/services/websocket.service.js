import dotenv from 'dotenv';
import logger from '../logger/index.logger.js';
dotenv.config();

// Defines the websocket service class
export default class WebSocketService {
  constructor({ ChatService }) {
    this.chatService = ChatService;
  }

  // Starts the websocket server
  websocketInit = (io) => {
    this.io = io;

    // Loggs a new connection in server terminal
    this.io.on('connect', async (socket) => {
      logger.info(`Nueva conexion desde el id: ${socket.id}`);

      // Emits a welcome message to the client
      socket.emit('welcome', {
        welcome: 'Bienvenido al servidor',
        messages: await this.chatService.getMessages(),
      });

      // Loggs a disconnection in server terminal
      socket.on('disconnect', () => {
        logger.info(`Cierre de conexion`);
      });

      // On new message, creates a new message and emits it to all clients so the chat is updated live
      socket.on('newMessage', async (data) => {
        try {
          const newMessage = await this.chatService.createMessage(data);
          this.io.emit('newMessage', newMessage);
        } catch (error) {
          throw error;
        }
      });

      // Notifies users when a new user joins the chat
      socket.on('newUser', (data) => {
        socket.broadcast.emit('newUser', data);
      });
    });
  };
}
