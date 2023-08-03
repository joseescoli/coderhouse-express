import CartsDaoMongoDB from "../dao/mongodb/managers/carts.dao.js"
const cartDao = new CartsDaoMongoDB();

// Persistencia de archivos
/* No se utilizará
import { CartManager } from "../dao/fs/CartManager.js";
import { __dirname } from "../path.js";
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
      const response = await cartDao.updateProdsCart(cid, prods);
      return response
    } catch (error) {
      console.log(error);
    }
  }

export const updateProdCantService = async (cid, pid, cant) => {
    try {
      const response = await cartDao.updateCantCart(cid, pid, cant);
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