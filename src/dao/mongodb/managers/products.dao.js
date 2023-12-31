// Incorporación de modelo productos de Mongoose para MongoDB
import { productsModel } from "../models/products.model.js";
// Incorporación de logger
import { logger } from "../../../utils/logger.js";

// Exportación y definición de clase principal de manejo de productos
export default class ProductsDaoMongoDB {

  
  // Método privado para verificar que todos los campos obligatorios del producto tengan información
  #allInfoCheck ( prod ) {
    return !!prod.title && !!prod.description && !!prod.price && !!prod.code && !!prod.stock && !!prod.category
  }

  // Método privado para verificar que el código del producto no esté duplicado
  async #duplicateCode ( code ) {
    const prods = await this.getAll()
    return !prods.some( p => p.code === code)
  }

  // Método para obtener todos los productos
  async getAll() {
    try {
      const response = await productsModel.find({});
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  // Método para obtener todos los productos con paginado
  async getAllProducts(limit, page, sort, query) {
    try {

      let paginate_filter = {}

      if ( query ) {
        if ( query.name ) {
          if ( query.name === 'status') {
            if ( query.value )
              paginate_filter = { status: 'true' }
            else
              paginate_filter = { $or: [{ status: 'false' }, { stock: 0 }] }
          }
          else {
            paginate_filter = { [query.name]: { $regex: String(query.value), $options: 'i' } }
          }
        }
      }
      
      //paginate_filter = { [query.name]: { $and: { $eq: query.value } } }

      let sorting = 1
      let response

      if ( sort ) {
        if( sort === '1' || sort === 'a')
          sorting = 1
        else
          sorting = -1

          response = await productsModel.paginate( paginate_filter,
            {
              limit: limit, page: page, sort: { price: sorting }
            }
          )
      }
      
      response = await productsModel.paginate( paginate_filter, { limit: limit, page: page } )

      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  // Método para obtener un producto mediante su ID
  async getProductById(id) {
    try {
      const response = await productsModel.findById(id);
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async getProductByOwner(owner) {
    try {
      const response = await productsModel.find({owner})
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  async changeProductOwner(owner) {
    try {
      const response = await productsModel.find({owner})
      if (response) {
        response.forEach( async item => {
          item.owner = 'admin'
          await item.save()
        })
        return true
      } else return false
    } catch (error) {
      logger.error(error.message)
    }
  }

  async getProductStockById(id) {
    try {
      const response = await productsModel.find({_id: id}, {stock: 1, _id: 0}).lean()
      return response
    } catch (error) {
      logger.error(error.message)
    }
  }

  // Método para obtener varios productos mediante ob array de IDs
  async getProductsByIds(ids) {
    try {
      const response = await productsModel.find({_id: ids});
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  // Método para crear producto enviado como objeto
  async createProduct(obj) {
    try {
      if ( await this.#duplicateCode(obj.code) || await this.getAllProducts().totalDocs === 0 ) {
        if ( this.#allInfoCheck( obj ) ) {
            const product = { status: true, ...obj }
            const response = await productsModel.create(product);
            return response
        } else {
            logger.debug('One or several attributes do not have proper information. Please, verify!');
            return false
        }
      } else {
          logger.debug('Duplicate "code" attribute! Please, choose another!');
          return false
      }
    } catch (error) {
      logger.error(error.message)
    }
  }

  // Método para actualizar atributos de un producto por ID
  async updateProduct(id, obj) {
    try {

      if ( await productsModel.findById(id) ) {

        if ( obj.code ) {

            if ( await this.#duplicateCode( obj.code ) ) {

              const response = await productsModel.updateOne({ _id: id }, obj);
              if (response) {
                logger.debug( "Product updated!" );
                return true;
              }

            } else {
                logger.debug('Duplicate "code" attribute! Please, choose another!');
                return false
            }

        } else {
          const response = await productsModel.updateOne({ _id: id }, obj);
          if (response) {
            logger.debug( "Product updated!" );
            return true;
          }
        }

      } else {
        logger.debug(`Product ID ${id} not found!`);
        return false
      }
      
    } catch (error) {
      logger.error(error.message)
    }
  }

  // Método para eliminar un producto mediante su ID
  async deleteProduct(id) {
    try {
      const response = await productsModel.findByIdAndDelete(id);
      logger.debug( `Product ID: ${id} removed!` );
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  // Método para eliminar todos los productos
  async deleteAllProducts(email) {
    try {
      const response = email ? await productsModel.deleteMany( { owner: email } ) : await productsModel.deleteMany({})
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

}