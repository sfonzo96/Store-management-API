import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import paginate from 'mongoose-paginate-v2';

// Defines the product schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    thumbnail: {
      type: String,
      required: true,
      default:
        'https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png',
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add paginate plugin to schema
productSchema.plugin(paginate);
//  Add soft delete plugin to schema
productSchema.plugin(mongooseDelete, { deletedAt: true });

const ProductModel = mongoose.model('Products', productSchema);

export default ProductModel;
