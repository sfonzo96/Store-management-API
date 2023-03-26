import CustomError from '../utils/CustomError.js';

export default class ViewController {
    constructor({ ChatService }) {
        this.chatService = ChatService;
    }

    getMessages = async (req, res, next) => {
        try {
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

    createMessage = async (req, res, next) => {
        try {
            const messageData = req.body;
            const newMessage = await this.chatService.createMessage(
                messageData
            );
            if (newMessage) {
                res.status(200).json({
                    success: true,
                    message: newMessage,
                });
            } else {
                throw new CustomError('SERVER_ERROR', 'Error creating message');
            }
        } catch (error) {
            next(error);
        }
    };
}
