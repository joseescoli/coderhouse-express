import { logger } from "../utils/logger.js";
import ProductsDaoMongoDB from "../dao/mongodb/managers/products.dao.js"
const prodDao = new ProductsDaoMongoDB();
import { createProductsMocking } from "../utils/utils.js";

// Agregado servicio de envio de correos
import { sendMailEthereal } from "./email.services.js";

// Módulo de métodos DAO de usuarios
import UserDao from "../dao/mongodb/managers/user.dao.js";

// Persistencia de archivos
/* No se utilizará
import { ProductManager } from "../dao/fs/ProductManager.js";
import { __dirname } from "./path.js";
const productManager = new ProductManager( __dirname + '/dao/fs/data/products.json' )
*/

export const getAllProds = async () => {
  try {
    const response = await prodDao.getAll();
    return response;
  } catch (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }
}

export const getAllService = async (limit, page, sort, query) => {
    try {
      const response = await prodDao.getAllProducts(limit, page, sort, query);
      return response;
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message)
    }
  }

export const getByIdService = async (id) => {
    try {
      const response = await prodDao.getProductById(id);
      return response;
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message)
    }
  }

export const getByOwnerService = async (email) => {
    try {
      const response = await prodDao.getProductByOwner(email);
      return response;
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message)
    }
  }

export const changeProdOwnerService = async (email) => {
    try {
      const response = await prodDao.changeProductOwner(email);
      return response;
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message)
    }
  }

export const createService = async (obj) => {
    try {
      const response = await prodDao.createProduct(obj);
      return response;
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message)
    }
  }

export const updateService = async (id, obj) => {
    try {
      return await prodDao.updateProduct(id, obj);
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message)
    }
  }

export const deleteByIdService = async (id) => {
    try {
      const userDao = new UserDao();
      const product = await getByIdService(id)
      if ( product ) {
        const response = await prodDao.deleteProduct(id);
        if ( product.owner && product.owner !== 'admin' ) {
          const user = await userDao.getByEmail(product.owner)
          await sendMailEthereal( { destination: user.email, service: 'productDeleted', name: user.first_name, product } )
        }
        return response
      } else return false
    } catch (error) {
      logger.error(error.message)
      throw new Error(error.message)
    }
  }

export const deleteAllService = async (email) => {
  try {
    const userDao = new UserDao();
    const products = await prodDao.getAll()
    if ( products ) {
      const response = await prodDao.deleteAllProducts(email);
      products.forEach( async prod => {
        if ( prod.owner && prod.owner !== 'admin' ) {
          const user = await userDao.getByEmail(prod.owner)
          await sendMailEthereal( { destination: user.email, service: 'productDeleted', name: user.first_name, product: prod } )
        }
      });
      return response;
    } else return false
  } catch (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

}

export const generateProductsMocking = async (cant) => {
  try {
    const products = createProductsMocking(cant)
    return products;
  } catch (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

}