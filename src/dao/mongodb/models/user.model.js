import { Schema, model, now } from "mongoose";

const documentSchema = new Schema({
    _id: false,
    name: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    }
})

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
        default: null
    },
    role: {
        type: String,
        default: 'user'
    },
    githubLogin: {
        type: Boolean,
        default: false
    },
    profileImg: {
        type: String,
        default: null
    },
    last_connection: {
        type: Date,
        default: Date.now
    },
    documents: {
        type: [documentSchema],
        default: []
    }
});

export const UserModel = model('users', userSchema);