import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.pre('find', function (next) {
    this.populate('user');
    next();
});

messageSchema.post('save', async function (doc, next) {
    try {
        await doc.populate('user');
    } catch (error) {
        return next(error);
    }
    next();
});

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
