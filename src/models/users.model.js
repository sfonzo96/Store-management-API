import mongoose from 'mongoose';

// Defines the user item schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      min: 0,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Carts',
      required: true,
      default: null,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['admin', 'user', 'premium'],
    },
    platform: {
      type: String,
      enum: ['github', null],
      default: null,
    },
    documents: [
      {
        name: {
          type: String,
          enum: ['idDoc', 'adressDoc', 'statusDoc'],
          required: true,
        },
        reference: {
          // This should store the url to the doc
          type: String,
          required: true,
        },
        _id: false,
      },
    ],
    lastConnection: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Populates the cart with the products data when a get operation is performed
userSchema.pre('findOne', function (next) {
  this.populate({
    path: 'cart',
    populate: {
      path: 'products.product',
    },
  });
  next();
});

const UserModel = mongoose.model('Users', userSchema);

export default UserModel;
