import { logger } from "../../../utils/logger.js";
import { ticketModel } from "../models/ticket.model.js";

export default class TicketsDaoMongoDB {

  async getAllTickets() {
    try {
      const response = await ticketModel.find({});
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async getTicketById(id) {
    try {
      const response = await ticketModel.findById(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async createTicket(obj) {
    try {
      // obj = { amount: 500, purchaser: 'correo@correo.com', code: cart.id }
      const response = await ticketModel.create(obj);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async updateTicket(id, obj) {
    try {
      await ticketModel.updateOne({ _id: id }, obj);
      return obj;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async deleteTicket(id) {
    try {
      const response = await ticketModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async deleteAllTickets() {
    try {
      const response = await ticketModel.deleteMany({})
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

}