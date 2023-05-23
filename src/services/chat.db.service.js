import MessageModel from '../models/message.model.js';

// Defines the messages service class
export default class MessagesService {
  // Creates a new message
  createMessage = async (data) => {
    try {
      const newMessage = await MessageModel.create(data);
      return newMessage;
    } catch (error) {
      throw error;
    }
  };

  // Gets all
  getMessages = async () => {
    try {
      const messages = await MessageModel.find().lean();
      return messages;
    } catch (error) {
      throw error;
    }
  };
}

// Repository could have been implemented as well
