import { msgModel } from "../models/messages.model.js";

export default class MessagesDaoMongoDB {
  async getAllMessages() {
    try {
      const response = await msgModel.find({});
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getMessageById(id) {
    try {
      const response = await msgModel.findById(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async createMessage(obj) {
    try {
      const response = await msgModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async updateMessage(id, obj) {
    try {
      await msgModel.updateOne({ _id: id }, obj);
      return obj;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteMessage(id) {
    try {
      const response = await msgModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAllMessages() {
    try {
      const response = await msgModel.deleteMany({})
      return response;
    } catch (error) {
      console.log(error);
    }
  }

}