import { Schema, Types, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: 'purchase_datetime', updatedAt: false } } );

export const ticketModel = model('ticket', ticketSchema);