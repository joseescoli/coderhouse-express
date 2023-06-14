// Constante fs para el manejo de archivos
const fs = require('fs');

// Clase principal ProductManager
class ProductManager {
    
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
        return !!prod.title && !!prod.description && !!prod.price && !!prod.code && !!prod.thumbnail && !!prod.stock
    }

    #duplicateCode ( code ) {
        return this.products.some( p => p.code !== code)
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
    addProduct(prod) {
    
        try {
            this.getProducts()
        } catch (error) {
            console.log(error)
        }

        if ( this.#duplicateCode (prod.code) || this.products.length === 0 ) {
            if ( this.#allInfoCheck( prod ) ) {
                this.#id = this.#lastId() + 1

                const producto = { id: this.#id, ...prod }
                this.products.push( producto )
                this.#saveProducts()
            } else {
                console.log('One or several attributes do not have proper information. Please, verify!');
                return 'One or several attributes do not have proper information. Please, verify!'
            }
        } else {
            console.log('Duplicate "code" attribute! Please, choose another!');
            return 'Duplicate "code" attribute! Please, choose another!'
        }
    }

    // Método para obtener un producto meduante su ID
    getProductById(ID) {

        try {
            this.getProducts()
        } catch (error) {
            console.log(error)
        }

        if ( this.products.some( p => p.id === ID) ) {
            return this.products.find(p => p.id === ID)
        } else {
            return `ID: ${ID} Not found`
        }

    }

    // Método para actualizar un producto
    async updateProduct ( obj ) {

        try {   this.getProducts()  }
        catch (error) { console.log(error)  }

        if ( this.products.some( p => p.id === obj.id) ) {
            const index = this.products.findIndex( p => p.id === obj.id )

            if ( this.#duplicateCode( obj.code ) || this.#duplicateCode( this.products[index].code ) ) {

                if ( index >= 0 ) {
                    const oldProd = this.products[index]
                    this.products[index] = { ...oldProd, ...obj }
                    this.#saveProducts()
                    return "Product updated!"
                } else {
                    return "Product not found!"
                }

            } else {
                console.log('Duplicate "code" attribute! Please, choose another!');
            }

        } else {
            console.log(`ID: ${obj.id} Not found`)
        }
    

    }

    // Método para eliminar un producto mediante su ID
    async deleteProduct (ID) {

        try {
            this.getProducts()
        } catch (error) {
          console.log(error);  
        }

        if ( this.products.some( p => p.id === ID) ) {
            const filter = this.products.filter( (prods) => prods.id !== ID);
            this.products = [...filter]
            this.#saveProducts()
            return `Product ID: ${ID} removed!`
        } else {
            return `ID: ${ID} not found`
        }

    }
  
}

/*
(
    async () => {
  */  

// TESTING propuesto en documento "Clase 2 - Testing de Entregable"
console.log("TESTING propuesto en documento -- Testing de Entregable\n\n");

// Instancia 1 de clase definida
const instancia1 = new ProductManager('./Entrega2/products.json')

console.log(`Listado de productos. Vacío o recuperando los productos del archivo.
======================================================`)
console.log( instancia1.getProducts() );
console.log(`======================================================`);

// Carga de producto
console.log("\nCarga de producto\n======================================================");

instancia1.addProduct(
    {
    title: "Producto Prueba",
    description: "Este es un producto de prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
}
)
console.log("======================================================\n");


// Listado de productos. Para este caso un único producto.
console.log(`Listado de productos. Único producto o todos incluyendo el último recuperando los productos del archivo.
======================================================`);
console.log( instancia1.getProducts() );
console.log(`======================================================`);


// Consulta de producto por ID inexistente
console.log("\nConsulta por ID inexistente\n======================================================");
console.log( instancia1.getProductById(10) );
console.log("======================================================\n");

// Consulta de producto por ID existente
console.log("\nConsulta por ID Existente\n======================================================");
console.log( instancia1.getProductById(1) );
console.log("======================================================\n");


console.log(`Cambio de producto
======================================================`);
instancia1.updateProduct(
    {
        id: 1,
        title: "INICIAL CAMBIADO",
        description: "TEST INICIAL CAMBIADO",
        code: "INICIAL CAMBIADO"
    }
)
console.log(`======================================================`);


console.log(`Listado de productos. Ver producto cambiado
======================================================`);
console.log( instancia1.getProducts() );
console.log(`======================================================`);

console.log(`Borrar producto ID 2
======================================================`);
console.log( instancia1.deleteProduct(2) );

console.log(`======================================================`);

console.log(`Listado de productos. Ver producto borrado
======================================================`);
console.log( instancia1.getProducts() );
console.log(`======================================================`);


// TESTING ADICIONAL - Segunda instancia de la clase
console.log("\n\nTESTING ADICIONAL\n\n");
const instancia2 = new ProductManager('./Entrega2/products.json')


console.log("\nCarga producto repetido\n======================================================");
// Carga de producto repetido. Se rechaza por código repetido.

instancia2.addProduct(
    {
        title: "Producto Prueba",
        description: "Este es un producto de prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25
    }
    )
    
console.log("======================================================\n");

console.log( instancia2.getProducts() );

//})()