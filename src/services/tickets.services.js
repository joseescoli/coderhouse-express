import { logger } from "../utils/logger.js";
import TicketsDaoMongoDB from "../dao/mongodb/managers/tickets.dao.js";
const ticketsDao = new TicketsDaoMongoDB()

export const getAllTicketsService = async () => {
  try {
    const response = await ticketsDao.getAllTickets()
    return response;
  } catch (error) {
    logger.error(error.message)
  }
}

export const getTicketByIdService = async (id) => {
    try {
      const response = await ticketsDao.getTicketById(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

export const createTicketService = async (obj) => {
    try {
      const response = await ticketsDao.createTicket(obj);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

export const updateTicketService = async (id, obj) => {
    try {
      return await ticketsDao.updateTicket(id, obj);
    } catch (error) {
      logger.error(error.message)
    }
  }

export const deleteTicketByIdService = async (id) => {
    try {
      const response = await ticketsDao.deleteTicket(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

export const deleteAllTicketsService = async () => {
  try {
    const response = await ticketsDao.deleteAllTickets();
    return response;
  } catch (error) {
    logger.error(error.message)
  }

}