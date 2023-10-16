// Modelo del token de acceso para el reseteo de contraseña
import { Schema, model } from "mongoose";
import config from "../../../config.js";

const tokenSchema = new Schema({
  // _id: false,
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  token: {
    type: String,
    required: true,
  },
/*  createdAt: {
    type: Date,
    default: Date.now,
    expires: config.RESET_TOKEN_EXPIRATION // vencimiento del token en segundos
    // expireAfterSeconds: config.RESET_TOKEN_EXPIRATION
    // expireAfterSeconds: "off"
  },
*/  expireAt: {
    type: Date,
    default: Date.now() + 60 * 60 * 1000,
    index: { expires: config.RESET_TOKEN_EXPIRATION }
    // expires: config.RESET_TOKEN_EXPIRATION
  },
  status: {
    type: String,
    default: 'true'
  }
});
export const TokenModel = model('Token', tokenSchema);