import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const purchaseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: nanoid(),
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  purchaser: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const TicketModel = mongoose.model('Ticket', purchaseSchema);

export default TicketModel;
