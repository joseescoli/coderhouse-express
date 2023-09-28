import CartsDaoMongoDB from "../dao/mongodb/managers/carts.dao.js"
const cartDao = new CartsDaoMongoDB();
import UserDao from "../dao/mongodb/managers/user.dao.js"
const userDao = new UserDao()
import { createTicketService } from "./tickets.services.js";

// Persistencia de archivos
/* No se utilizará
import { CartManager } from "../dao/fs/CartManager.js";
import { __dirname } from "../utils/path.js";
const cartManager = new CartManager( __dirname + '/src/dao/fs/data/carts.json' )
*/

export const getAllService = async () => {
    try {
      const response = await cartDao.getAllCarts();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const getByIdService = async (id) => {
    try {
      const response = await cartDao.getCartById(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const createService = async () => {
    try {
      const obj = { products: [] }
      const response = await cartDao.createCart(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const updateService = async (cid, pid, action) => {
    try {
      const response = await cartDao.updateCart(cid, pid, action);
      return response
    } catch (error) {
      console.log(error);
    }
  }

export const addProdsService = async (cid, prods) => {
    try {
      let result = 0
      //const response = await cartDao.updateProdsCart(cid, prods);
      await prods.map( async item => {
        const response = await cartDao.updateCantCart(cid, item.product, item.quantity, 'add')
          console.log("MAP response: " + response)
          if ( response === 1 ) result = 1
          console.log("MAP result: " + result)
        })
        console.log("Result: " + result);
        return (result === 1 ? true : false)
    } catch (error) {
      console.log(error);
    }
  }

export const updateProdCantService = async (cid, pid, cant) => {
    try {
      const response = await cartDao.updateCantCart(cid, pid, cant, 'overwrite');
      return response
    } catch (error) {
      console.log(error);
    }
  }

export const deleteByIdService = async (id) => {
    try {
      const response = await cartDao.deleteCart(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const deleteAllService = async () => {
  try {
    const response = await cartDao.deleteAllCarts();
    return response;
  } catch (error) {
    console.log(error);
  }

}

export const emptyCartService = async (cid) => {
  try {
    const response = await cartDao.emptyCart(cid);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const purchaseCartService = async (ticket) => {
  try {
    const response = await cartDao.purchaseCart(ticket)
    if ( response ) {
      // console.log(response);
      await userDao.newCart(ticket.purchaser)
      await createTicketService( { ...ticket, amount: response })
    }
    return response
  } catch (error) {
    console.log(error);
  }
}