import { msgModel } from "../models/messages.model.js";
import { logger } from "../../../utils/logger.js";

export default class MessagesDaoMongoDB {
  async getAllMessages() {
    try {
      const response = await msgModel.find({});
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async getMessageById(id) {
    try {
      const response = await msgModel.findById(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async createMessage(obj) {
    try {
      const response = await msgModel.create(obj);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async updateMessage(id, obj) {
    try {
      await msgModel.updateOne({ _id: id }, obj);
      return obj;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async deleteMessage(id) {
    try {
      const response = await msgModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async deleteAllMessages() {
    try {
      const response = await msgModel.deleteMany({})
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

}