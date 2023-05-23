import mongoose from 'mongoose';

// Defines the message schema
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

// Populates user when a read operation is performed
messageSchema.pre('find', function (next) {
  this.populate('user');
  next();
});

// Adds user data when a create or update operation is performed
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
