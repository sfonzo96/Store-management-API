import CustomError from '../utils/CustomError.js';

export default class ViewController {
  constructor({ ChatService }) {
    this.chatService = ChatService;
  }

  getMessages = async (req, res, next) => {
    try {
      // Gets the messages stored in the db
      const messages = await this.chatService.getMessages();
      if (messages.length > 0) {
        res.status(200).json({
          success: true,
          data: messages,
        });
      } else {
        res.status(200).json({
          success: true,
          data: [],
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
