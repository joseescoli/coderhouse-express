// Constante fs para el manejo de archivos
import fs from 'fs';
import prodmanager from '../manager/ProductManager.js'

// Clase principal CartManager
export default class CartManager {
    
    constructor(path) {
        this.carts = []
        this.path = path
        this.#id
    }
    
    #id = 0
    
    // Método privado para obtener el último id utilizado
    #lastId () {
        this.#id = this.carts.reduce(        (getId, cart) => (cart.id > getId ? cart.id : getId), 0     )
        return this.#id
    }

    #allInfoCheck ( cart ) {
        return !!cart.products.product && !!cart.products.quantity
    }
    
    // Método para obtener los carritos
    getCarts () {
        try {
            if (fs.existsSync(this.path)){
                const carts = fs.readFileSync(this.path, 'utf8');
                this.carts = [...JSON.parse(carts)]
                // console.log(this.carts);
                return this.carts
            } else {
                // console.log(this.carts);
                return this.carts
            }
        } catch (error) {
          console.log(error);
        }
    }

    // Método para guardar los carritos cargados
    #saveCarts () {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts));
        } catch (error) {
            console.log(error);
        }
    }
    // Método para cargar carrito enviado como objeto
    addCart() {
    
        try {   this.getCarts() }
        catch (error) {   console.log(error)  }

        this.#id = this.#lastId() + 1

        const cart = { id: this.#id, products: [] }
        this.carts.push( cart )
        this.#saveCarts()
        return true
    }

    // Método para obtener el objeto carrito mediante su ID
    getCartById(ID) {

        try {   this.getCarts() }
        catch (error) { console.log(error)  }

        const index = this.carts.findIndex( c => c.id === ID)

        if ( index >= 0 ) {
            return this.carts[index]
        } else {
            console.log( `Cart ID: ${ID} Not found` );
            return false
        }

    }

    // Método para obtener el índice del arreglo de carritos mediante su ID
    getCartByIndex(ID) {

        try {   this.getCarts() }
        catch (error) { console.log(error)  }

        const index = this.carts.findIndex( c => c.id === ID)

        if ( index >= 0 ) {
            return index
        } else {
            console.log( `Cart ID: ${ID} Not found` );
            return false
        }

    }

    // Método para actualizar un carrito
    async updateCart ( cid, pid, action ) {

        try {   this.getCarts()  }
        catch (error) { console.log(error)  }

        const prodExist = prodmanager.getProductById(pid) || 0
        if ( prodExist ) {

            const index = this.getCartByIndex(cid)

                if ( index >= 0 ) {
                    const prods = [...this.carts[index].products]
                    
                    const pindex = prods.findIndex( p => p.product === pid)
                    if ( pindex >= 0 ) {
                        if ( action === "add" ) {
                            if ( this.carts[index].products[pindex].quantity < prodExist.stock )
                                this.carts[index].products[pindex].quantity++
                            else {
                                console.log( `Product ID: ${pid} out of stock!` );
                                return false
                            }
                        } else {
                            if ( prodExist.stock > 0 ) {
                                if ( this.carts[index].products[pindex].quantity > 0 )
                                    this.carts[index].products[pindex].quantity--
                                else
                                    this.carts[index].products.splice(pindex, 1)
                            }
                            else
                                console.log( `Product ID: ${pid} out of stock!` );
                        }
                    } else {
                        if ( action === "add" ) {
                            if ( prodExist.stock > 0 )
                                this.carts[index].products.push({product: pid, quantity: 1})
                            else {
                                console.log( `Product ID: ${pid} out of stock!` );
                                return false
                            }
                        }
                        else {
                            console.log( `Product ID: ${pid} not present in cart!` );
                            return false
                        }
                    }
                    this.#saveCarts()
                    console.log( "Cart updated!" );
                    return true
                } else {
                    console.log( `Cart ID: ${cid} not found!` );
                    return false
                }
        }

    }

    // Método para eliminar un carrito mediante su ID
    async deleteCart (ID) {

        try {   this.getCarts() }
        catch (error) { console.log(error);  }

        if ( this.carts.some( p => p.id === ID) ) {
            const filter = this.carts.filter( (carts) => carts.id !== ID);
            this.carts = [...filter]
            this.#saveCarts()
            console.log( `Cart ID: ${ID} removed!` );
            return true
        } else {
            console.log( `Cart ID: ${ID} not found` );
            return false
        }

    }

    async deleteAllCarts(){
        try {
            if(fs.existsSync(this.path)){
                await fs.promises.unlink(this.path)
            }
        } catch (error) {
            console.log(error);
        }
    }
  
}