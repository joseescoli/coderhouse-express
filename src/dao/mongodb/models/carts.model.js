import mongoose from 'mongoose';

const cartProdRelSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    }
})

const cartSchema = new mongoose.Schema({
    products: { type: [cartProdRelSchema], required: true, default: [] }
});

export const cartsModel = mongoose.model('carts', cartSchema);
