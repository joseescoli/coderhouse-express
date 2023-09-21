import { ticketModel } from "../models/ticket.model.js";

export default class TicketsDaoMongoDB {

  async getAllTickets() {
    try {
      const response = await ticketModel.find({});
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getTicketById(id) {
    try {
      const response = await ticketModel.findById(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async createTicket(obj) {
    try {
      // obj = { amount: 500, purchaser: 'correo@correo.com', code: cart.id }
      const response = await ticketModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTicket(id, obj) {
    try {
      await ticketModel.updateOne({ _id: id }, obj);
      return obj;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTicket(id) {
    try {
      const response = await ticketModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAllTickets() {
    try {
      const response = await ticketModel.deleteMany({})
      return response;
    } catch (error) {
      console.log(error);
    }
  }

}