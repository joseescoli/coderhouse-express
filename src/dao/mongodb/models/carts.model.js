import {Schema, model} from 'mongoose';

const cartProdRelSchema = new Schema({
    _id: false,
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
})

const cartSchema = new Schema({
    products: { type: [cartProdRelSchema], required: true, default: [] }
});

export const cartsModel = model('carts', cartSchema);