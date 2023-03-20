export default class ViewController {
    constructor({ ChatService }) {
        this.chatService = ChatService;
    }

    getMessages = async (req, res) => {
        try {
            const messages = await this.chatService.getMessages();
            if (messages.length > 0) {
                res.status(200).json({
                    success: true,
                    data: messages,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Products not found',
                });
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };

    createMessage = async (req, res) => {
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
                res.status(404).json({
                    success: false,
                    message: 'Products not found',
                });
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };
}
