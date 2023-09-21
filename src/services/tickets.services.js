import TicketsDaoMongoDB from "../dao/mongodb/managers/tickets.dao.js";
const ticketsDao = new TicketsDaoMongoDB()

export const getAllTicketsService = async () => {
  try {
    const response = await ticketsDao.getAllTickets()
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const getTicketByIdService = async (id) => {
    try {
      const response = await ticketsDao.getTicketById(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const createTicketService = async (obj) => {
    try {
      const response = await ticketsDao.createTicket(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const updateTicketService = async (id, obj) => {
    try {
      return await ticketsDao.updateTicket(id, obj);
    } catch (error) {
      console.log(error);
    }
  }

export const deleteTicketByIdService = async (id) => {
    try {
      const response = await ticketsDao.deleteTicket(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const deleteAllTicketsService = async () => {
  try {
    const response = await ticketsDao.deleteAllTickets();
    return response;
  } catch (error) {
    console.log(error);
  }

}