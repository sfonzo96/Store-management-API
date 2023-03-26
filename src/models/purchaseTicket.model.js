import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const purchaseSchema = new mongoose.Schema(
    {
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
            requires: true,
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
    },
    {
        methods: {
            setSubtotal() {
                this.subtotal = this.products.reduce((accumulator, current) => {
                    return accumulator + current.price * current.quantity;
                }, 0);
            },
        },
    }
);

//TODO: setSubtotal not working, set products as a reference

/* purchaseSchema.post('save', function (next) {
    this.setSubtotal();
    next();
}); */

const TicketModel = mongoose.model('Ticket', purchaseSchema);

export default TicketModel;
