import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";


const productSchema = new mongoose.Schema({
    status: { type: Boolean, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: Array, default: [] },
    owner: { type: String, default: 'admin'}
});

productSchema.plugin( mongoosePaginate );

export const productsModel = mongoose.model( 'products', productSchema );