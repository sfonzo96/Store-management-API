import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import paginate from 'mongoose-paginate-v2';

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
        'https://shoptheoldemercantile.com/image/cache/catalog/placeholderproduct-500x500.png',
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
      default: null,
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

productSchema.plugin(paginate);
productSchema.plugin(mongooseDelete, { deletedAt: true });

const ProductModel = mongoose.model('Products', productSchema);

export default ProductModel;
