import MessageModel from '../models/message.model.js';

export default class MessagesService {
  createMessage = async (data) => {
    try {
      const newMessage = await MessageModel.create(data);
      return newMessage;
    } catch (error) {
      throw error;
    }
  };

  getMessages = async () => {
    try {
      const messages = await MessageModel.find().lean();
      return messages;
    } catch (error) {
      throw error;
    }
  };
}
