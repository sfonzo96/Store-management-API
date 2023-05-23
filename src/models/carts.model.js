import mongoose from 'mongoose';

// Defines the cart item schema
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

// Defines the cart schema
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

// Populates cart items when a read operation is performed
cartSchema.pre('findOne', function (next) {
  this.populate('products.product');
  next();
});

const CartModel = mongoose.model('Carts', cartSchema);
export default CartModel;
