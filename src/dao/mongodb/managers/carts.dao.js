// Incorporación de modelo carritos de Mongoose para MongoDB
import { cartsModel } from "../models/carts.model.js";
// Llamadas de métodos de productos
import ProductsDaoMongoDB from "./products.dao.js";
// Incorporación de logger
import { logger } from "../../../utils/logger.js";

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
      logger.error(error.message)
    }
  }

  // Método para obtener el objeto carrito mediante su ID
  async getCartById(id) {
    try {
      const response = await cartsModel.findById(id).populate("products.product");
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }

  // Método para crear un carrito nuevo
  async createCart(obj) {
    try {
      const response = await cartsModel.create(obj)
      return response;
    } catch (error) {
      logger.error(error.message)
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
      logger.error(error.message)
    }
  }

  // Método para actualizar un carrito por su ID recibiendo el ID de producto a agregar. INCREMENTA O DISMINUYE LA CANTIDAD DE UN PRODUCTO SÓLO EN 1 UNIDAD
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
            logger.debug( `Product ID: ${pid} out of stock!. Max: ${product.stock}` );
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
            logger.debug( `Product ID: ${pid} out of stock or inactive!` );
            return false
          }
        }
        else {
          // Al no encontrarse el producto en el carrito y llamarse a la operación de quitado del producto se da aviso de lo incompatible
          logger.debug( `Product ID: ${pid} not added to cart!` );
          return false
        }
      }
    } catch (error) {
      logger.error(error.message)
    }
  }

  // Método para actualizar un carrito por su ID recibiendo el ID de producto a agregar y la cantidad específica a designar. DESIGNA O AGREGA LA CANTIDAD DE UN PRODUCTO POR PARÁMETRO
  async updateCantCart(cid, pid, cant, action) {
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
          // Comprueba si la operación para agregar las cantidades debe sobreescribirse o debe sumarse al producto ya encontrado
          if ( action === 'overwrite' ) {
            // Comprueba que el carrito pueda agregar el producto si no se superó el stock
            if( cant <= product.stock) {
              existingProduct.quantity = cant
              await cart.save()
              return 1
            }
            else {
              logger.debug( `Product ID: ${pid} out of stock!. Max: ${product.stock}` );
              return -1
            }
          } else {
            // Comprueba que el carrito pueda agregar el producto si no se superó el stock
            if( cant + existingProduct.quantity <= product.stock) {
              existingProduct.quantity += cant
              await cart.save()
              return 1
            }
            else {
              logger.debug( `Product ID: ${pid} out of stock!. Max: ${product.stock}` );
              return -1
            }            
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
              logger.debug( `Product ID: ${pid} out of stock or inactive!` );
              return -1
            }
        }
    }
    } catch (error) {
      logger.error(error.message)
    }
  }

// Método para actualizar un carrito por su ID recibiendo un arreglo de productos a agregar y la cantidad específica a designar
/*
async updateProdsCart(cid, prods) {
  try {
    const cart = await this.getCartById(cid)
    let cartUpdated = false
    const updateCart = []
    if ( cart ) {
      prods.forEach( async (item) => {
        const checkstock = await this.prodManager.getProductStockById(item.product)
        let stock
        checkstock.map(prod => stock = prod.stock)
        if ( item.quantity > stock )
          console.log( `Product ID: ${item.product} out of stock!. Max: ${stock}` );
        else {
          updateCart.push({product: item.product, quantity: item.quantity})
          cartUpdated = true
          //const updateCart = await cartsModel.findByIdAndUpdate({_id: cart._id})
          //console.log(stock);
          //console.log({product: item.product, quantity: item.quantity})
          //prodStockOk.push({product: item.product, quantity: item.quantity})
        }
      })
      console.log(updateCart)//no se ven los objetos. Revisar
      //console.log(prodStockOk)
      //cart.products = prods
      //await cart.save()
      if ( cartUpdated ) {
        cart.products = updateCart
        await cart.save()
        return true
      } else
        return false
    }
    else {
      console.log("Cart not found!");
      return false
    }
  } catch (error) {
    console.log(error);
  }
}
*/

  // Método para eliminar un carrito mediante su ID
  async deleteCart(id) {
    try {
      const response = await cartsModel.findByIdAndDelete(id);
      return response
    } catch (error) {
      logger.error(error.message)
    }
  }
  
  // Método para eliminar todos los carritos
  async deleteAllCarts() {
    try {
      const response = await cartsModel.deleteMany({})
      return response;
    } catch (error) {
      logger.error(error.message)
    }
  }
  
  // Método para grabar la compra del carrito mediante su ID
  async purchaseCart(ticket) {
    try {

      // Carga de carrito actual para la compra
      const cart = await this.getCartById(ticket.code);

      // Se comprueba que el carrito actual tenga productos para comprar
      if ( !cart || cart.products.length === 0 ) return false
      else {

        // Constante filtrada con los productos del carrito que tengan stock disponible de acuerdo a la cantidad solicitada
        const cartFilter = cart.products.filter( prod => prod.product.stock >= prod.quantity )

        // Se verifica que todos los productos seleccionados tengan stock
        if ( cart.products.length === cartFilter.length ) {
          // Corrige el stock de los productos con la cantidad solicitada. cartFilter ya tiene verificado que poseen stock
          cart.products.forEach( (prod) => {
            prod.product.stock -= prod.quantity
            prod.product.save()
          })

        }
        // Al haber productos sin stock se disminuye el stock de los productos que están disponibles y se retiran del carrito actual los productos sin stock
        else {
          cartFilter.forEach( (prod) => {
            prod.product.stock -= prod.quantity
            prod.product.save()
          })
          // Carga de productos al carrito actual que tengan stock disponible de acuerdo a la cantidad solicitada
          cart.products = [ ...cartFilter ]
          await cart.save()
        }
        
        // logger.debug("\n\nCarrito actual:\n" + (await this.getCartById(ticket.code)).products);

        // Se calcula el monto del carrito para informar al usuario
        const amount = cartFilter.reduce( ( subtotal, item ) => subtotal + item.quantity * item.product.price, 0 )

        return amount
      }  
    } catch (error) {
      logger.error(error.message)
    }
  }

}