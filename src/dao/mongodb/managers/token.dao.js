import { logger } from "../../../utils/logger.js";
import { TokenModel } from "../models/token.model.js";

export default class TokenDaoMongoDB {

  async getAllTokens() {
    try {
      const response = await TokenModel.find({});
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async getTokenById(id) {
    try {
      const response = await TokenModel.findById(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async getTokenByUser(user) {
    try {
      const response = await TokenModel.findOne({ user, status: 'true' });
      if ( response ) return response
      else return false
    } catch (error) {
      logger.error(error.message)
    }
  }

  async disableToken(id) {
    try {
      const token = await this.getTokenById(id)
      if ( token ) {
        token.status = 'false'
        await token.save()
        return true
      } else return false
    } catch (error) {
      logger.error(error.message)
    }
  }

  async getTokenByHash(token) {
    try {
      const response = await TokenModel.findOne({token});
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async createToken(obj) {
    try {
      const response = await TokenModel.create(obj);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async deleteToken(id) {
    try {
      const response = await TokenModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async deleteAllTokens() {
    try {
      const response = await TokenModel.deleteMany({})
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

}