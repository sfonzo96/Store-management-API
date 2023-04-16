import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        type: cartItemSchema,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// get cart from db POPULATED WITH MIDDLEWARE (SO INFO IS AVAILABLE!!)

cartSchema.pre('findOne', function (next) {
  this.populate('products.product');
  next();
});

const CartModel = mongoose.model('Carts', cartSchema);
export default CartModel;
