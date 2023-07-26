import ProductsDaoMongoDB from "../dao/mongodb/managers/products.dao.js"
const prodDao = new ProductsDaoMongoDB();

// Persistencia de archivos
/* No se utilizará
import { ProductManager } from "../dao/fs/ProductManager.js";
import { __dirname } from "../path.js";
const productManager = new ProductManager( __dirname + '/src/dao/fs/data/products.json' )
*/

export const getAllService = async () => {
    try {
      const response = await prodDao.getAllProducts();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const getByIdService = async (id) => {
    try {
      const response = await prodDao.getProductById(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const createService = async (obj) => {
    try {
      const response = await prodDao.createProduct(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const updateService = async (id, obj) => {
    try {
      return await prodDao.updateProduct(id, obj);
    } catch (error) {
      console.log(error);
    }
  }

export const deleteByIdService = async (id) => {
    try {
      const response = await prodDao.deleteProduct(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

export const deleteAllService = async () => {
  try {
    const response = await prodDao.deleteAllProducts();
    return response;
  } catch (error) {
    console.log(error);
  }

}