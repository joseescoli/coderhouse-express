// Incorporación de modelo carritos de Mongoose para MongoDB
import { cartsModel } from "../models/carts.model.js";
// Llamadas de métodos de productos
import ProductsDaoMongoDB from "./products.dao.js";

// Exportación y definición de clase principal de manejo de carritos
export default class CartsDaoMongoDB {

  // Instanciada clase de productos
  prodManager = new ProductsDaoMongoDB()


  // Método para obtener todos los carritos
  async getAllCarts() {
    try {
      const response = await cartsModel.find({});
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para obtener el objeto carrito mediante su ID
  async getCartById(id) {
    try {
      const response = await cartsModel.findById(id).populate("products.product");
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para crear un carrito nuevo
  async createCart(obj) {
    try {
      const response = await cartsModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para vaciar el carrito mediante su ID
  async emptyCart(cid) {
    try {
      const cart = await this.getCartById(cid);
      if(cart) {
      cart.products = []
      cart.save()
      return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Método para actualizar un carrito por su ID recibiendo el ID de producto a agregar
  async updateCart(cid, pid, action) {
    try {
      // Generación de constantes para el tratamiento del producto, carrito y el ID del array de productos a analizar
      const product = await this.prodManager.getProductById(pid);
      const cart = await this.getCartById(cid);
      const existingProduct = cart.products.find(
      (item) => item.product._id.toString() === product._id.toString()
      )
      // Verifica si existe el producto en el carrito
      if (existingProduct) {
        // Verifica si se lanzó la llamada para agregar el producto
        if(action === "+") {
          // Comprueba que el carrito pueda agregar el producto si no se superó el stock
          if(existingProduct.quantity < product.stock) {
            existingProduct.quantity++;
            await cart.save()
            return true
          }
          else {
            console.log( `Product ID: ${pid} out of stock!. Max: ${product.stock}` );
            return false
          }
        } else {
          // Por el caso contrario se considera haberse lanzado la llamada para quitar el producto del carrito

          // Comprueba si el producto en cuestión posee stock
          if(product.stock > 0) {
            // Se comprueba que el carrito tenga ingresada la cantidad del producto superior a 1 para poder restarse
            if(existingProduct.quantity > 1) {
              existingProduct.quantity--
              await cart.save()
              return true
            }
          else {
              // Caso contrario, de comprobarse que la cantidad del producto es 1, se elimina el objeto relacionado al producto dentro del arreglo products
              cart.products.pull(existingProduct._id)
              await cart.save()
              return true
            }
          } else {
            // Se quita, en caso de presentarse algún caso de adulterio de MongoDB o bug, el objeto relacionado al producto dentro del arreglo products en caso que el producto no tenga stock
            cart.products.pull(existingProduct._id)
            await cart.save()
            return true
          }
        }
      } else {
        // Al no encontrarse el producto en el carrito y llamarse a la operación de agregado de producto se incorpora el ID y la cantidad en 1
        if(action === '+') {
          // Todo lo anterior dicho sólo si el producto posee stock
          if (product.stock > 0 && product.status) {
            cart.products.push({ product, quantity: 1 })
            await cart.save()
            return true
          }
          else {
            console.log( `Product ID: ${pid} out of stock or inactive!` );
            return false
          }
        }
        else {
          // Al no encontrarse el producto en el carrito y llamarse a la operación de quitado del producto se da aviso de lo incompatible
          console.log( `Product ID: ${pid} not added to cart!` );
          return false
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Método para actualizar un carrito por su ID recibiendo el ID de producto a agregar y la cantidad específica a designar
  async updateCantCart(cid, pid, cant) {
    try {
      // Generación de constantes para el tratamiento del producto, carrito y el ID del array de productos a analizar
      const product = await this.prodManager.getProductById(pid);
      if ( !product ) return 0
      else {
        const cart = await this.getCartById(cid);
        const existingProduct = cart.products.find(
        (item) => item.product._id.toString() === product._id.toString()
        )
        // Verifica si existe el producto en el carrito
        if (existingProduct) {
            // Comprueba que el carrito pueda agregar el producto si no se superó el stock
            if( cant <= product.stock) {
              existingProduct.quantity = cant
              await cart.save()
              return 1
            }
            else {
              console.log( `Product ID: ${pid} out of stock!. Max: ${product.stock}` );
              return -1
            }
        } else {
          // Al no encontrarse el producto en el carrito y se incorpora el ID y la cantidad
          // Todo lo anterior dicho sólo si el producto posee stock
            if (product.stock > 0 && product.status) {
              cart.products.push({ product, quantity: cant })
              await cart.save()
              return 1
            }
            else {
              console.log( `Product ID: ${pid} out of stock or inactive!` );
              return -1
            }
        }
    }
    } catch (error) {
      console.log(error);
    }
  }

// Método para actualizar un carrito por su ID recibiendo el ID de producto a agregar y la cantidad específica a designar
async updateProdsCart(cid, prods) {
  try {
    // Generación de constantes para el tratamiento del producto, carrito y el ID del array de productos a analizar
    const products = await this.prodManager.getProductsByIds(prods.ids);
    if ( products.length === 0) return 0
    else {
      await this.emptyCart(cid)
      const cart = await this.getCartById(cid);
    // Se verifica que cada producto tenga stock para ser agregado
    prods.forEach( prod => {
      
      if (products.stock > 0 && products.status) {
        cart.products.push({ product: products.ids, quantity: prods.quantities })
        cart.save()
        return 1
      }
      else {
        console.log( `Product ID: ${pid} out of stock or inactive!` );
        return -1
      }

    })

  }
  } catch (error) {
    console.log(error);
  }
}

  // Método para eliminar un carrito mediante su ID
  async deleteCart(id) {
    try {
      const response = await cartsModel.findByIdAndDelete(id);
      return response
    } catch (error) {
      console.log(error);
    }
  }

  // Método para eliminar todos los carritos
  async deleteAllCarts() {
    try {
      const response = await cartsModel.deleteMany({})
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}