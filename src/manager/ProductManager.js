// Constante fs para el manejo de archivos
import fs from 'fs';

// Clase principal ProductManager
export default class ProductManager {
    
    constructor(path) {
        this.products = []
        this.path = path
        this.#id
    }
    
    #id = 0
    
    // Método privado para obtener el último id utilizado
    #lastId () {
        this.#id = this.products.reduce(        (getId, prod) => (prod.id > getId ? prod.id : getId), 0     )
        return this.#id
    }

    #allInfoCheck ( prod ) {
        return !!prod.title && !!prod.description && !!prod.price && !!prod.code && !!prod.stock && !!prod.category
    }

    #duplicateCode ( code ) {
        return !this.products.some( p => p.code === code)
    }
    
    
    // Método para obtener los productos
    getProducts () {
        try {
            if (fs.existsSync(this.path)){
                const products = fs.readFileSync(this.path, 'utf8');
                this.products = [...JSON.parse(products)]
                // console.log(this.products);
                return this.products
            } else {
                // console.log(this.products);
                return this.products
            }
        } catch (error) {
          console.log(error);
        }
    }

    // Método para guardar los productos cargados
    #saveProducts () {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products));
        } catch (error) {
            console.log(error);
        }
    }
    // Método para cargar productos enviado como objeto
    async addProduct(prod) {
    
        try {   this.getProducts()  }
        catch (error) { console.log(error)  }

        if ( this.#duplicateCode(prod.code) || this.products.length === 0 ) {
            if ( this.#allInfoCheck( prod ) ) {
                this.#id = this.#lastId() + 1

                const product = { id: this.#id, status: true, ...prod }
                this.products.push( product )
                this.#saveProducts()
                return true
            } else {
                console.log('One or several attributes do not have proper information. Please, verify!');
                return false
            }
        } else {
            console.log('Duplicate "code" attribute! Please, choose another!');
            return false
        }
    }

    // Método para obtener un producto mediante su ID
    getProductById(ID) {

        try {
            this.getProducts()
        } catch (error) {
            console.log(error)
        }

        if ( this.products.some( p => p.id === ID) ) {
            return this.products.find(p => p.id === ID)
        } else {
            console.log( `Product ID: ${ID} Not found` );
            return false
        }

    }

    // Método para actualizar un producto
    async updateProduct ( obj ) {

        try {   this.getProducts()  }
        catch (error) { console.log(error)  }

        const index = this.products.findIndex( p => p.id === obj.id )

        if ( index >= 0 ) {

            if ( obj.code ) {

                if ( this.#duplicateCode( obj.code ) ) {

                    const oldProd = this.products[index]
                    this.products[index] = { ...oldProd, ...obj }
                    this.#saveProducts()
                    console.log( "Product updated!" );
                    return true

                } else {
                    console.log('Duplicate "code" attribute! Please, choose another!');
                    return false
                }

            } else {
                const oldProd = this.products[index]
                this.products[index] = { ...oldProd, ...obj }
                this.#saveProducts()
                console.log( "Product updated!" );
                return true
            }

        } else {
            console.log(`Product ID: ${obj.id} not found`)
            return false
        }
    

    }

    // Método para eliminar un producto mediante su ID
    async deleteProduct (ID) {

        try {   this.getProducts()  }
        catch (error) { console.log(error)     }

        if ( this.products.some( p => p.id === ID) ) {
            const filter = this.products.filter( (prods) => prods.id !== ID);
            this.products = [...filter]
            this.#saveProducts()
            console.log( `Product ID: ${ID} removed!` );
            return true
        } else {
            console.log( `Product ID: ${ID} not found` );
            return false
        }

    }

    async deleteAllProducts(){
        try {
            if(fs.existsSync(this.path)){
                await fs.promises.unlink(this.path)
            }
        } catch (error) {
            console.log(error);
        }
    }
  
}