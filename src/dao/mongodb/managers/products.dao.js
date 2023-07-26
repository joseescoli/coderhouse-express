// Incorporación de modelo productos de Mongoose para MongoDB
import { productsModel } from "../models/products.model.js";
// Exportación y definición de clase principal de manejo de productos
export default class ProductsDaoMongoDB {

  
  // Método privado para verificar que todos los campos obligatorios del producto tengan información
  #allInfoCheck ( prod ) {
    return !!prod.title && !!prod.description && !!prod.price && !!prod.code && !!prod.stock && !!prod.category
  }

  // Método privado para verificar que el código del producto no esté duplicado
  async #duplicateCode ( code ) {
    const prods = await this.getAllProducts()
    return !prods.some( p => p.code === code)
  }

  // Método para obtener todos los productos
  async getAllProducts() {
    try {
      const response = await productsModel.find({});
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para obtener un producto mediante su ID
  async getProductById(id) {
    try {
      const response = await productsModel.findById(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para crear producto enviado como objeto
  async createProduct(obj) {
    try {
      if ( await this.#duplicateCode(obj.code) || await this.getAllProducts().length === 0 ) {
        if ( this.#allInfoCheck( obj ) ) {
            const product = { status: true, ...obj }
            const response = await productsModel.create(product);
            return response
        } else {
            console.log('One or several attributes do not have proper information. Please, verify!');
            return false
        }
      } else {
          console.log('Duplicate "code" attribute! Please, choose another!');
          return false
      }
    } catch (error) {
      console.log(error);
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
                console.log( "Product updated!" );
                return true;
              }

            } else {
                console.log('Duplicate "code" attribute! Please, choose another!');
                return false
            }

        } else {
          const response = await productsModel.updateOne({ _id: id }, obj);
          if (response) {
            console.log( "Product updated!" );
            return true;
          }
        }

      }
      
    } catch (error) {
      console.log(error);
    }
  }

  // Método para eliminar un producto mediante su ID
  async deleteProduct(id) {
    try {
      const response = await productsModel.findByIdAndDelete(id);
      console.log( `Product ID: ${id} removed!` );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para eliminar todos los productos
  async deleteAllProducts() {
    try {
      const response = await productsModel.deleteMany({})
      return response;
    } catch (error) {
      console.log(error);
    }
  }

}