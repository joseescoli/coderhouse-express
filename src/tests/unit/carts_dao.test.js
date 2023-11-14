// SE IMPORTA EL DAO A TESTEAR Y DEBAJO LA INSTANCIA LA CLASE
import CartsDaoMongoDB from '../../dao/mongodb/managers/carts.dao.js';
const cartsDao = new CartsDaoMongoDB()
// Se incorpora "chai" como módulo seleccionado para el testing
import { expect, assert } from 'chai';
// Se incorporan los logs
import { logger } from '../../utils/logger.js';

// Conexión a base de datos MongoDB Atlas
import { dbConnect, dbDisconnect } from '../../dao/mongodb/dbconnection.js';

// Módulo collections para manipular las colecciones de Mongo
import pkg from 'mongoose';
const { connection } = pkg;
const { collections } = connection

// Servicios de productos
import { createDemoProductsTestingDB } from '../../utils/utils.js';
import { getAllProds } from '../../services/products.services.js';

const generateDemoProds = async (n = 1) => {
    collections["products"].drop();
    const productsMongo = await createDemoProductsTestingDB(n)
    const obj = { products: [] }
    productsMongo.map( item => obj.products.push ( { product: item._id, quantity: Math.floor(Math.random() * item.stock) + 1 } ) )
    return obj
}

// Pruebas
describe(`
========================================================================
Testing unitario del DAO de Carritos - Base de datos test, Mongo Atlas
========================================================================
`, () => {

    before( async () => {
        logger.debug('*****Inicio de pruebas******');
        await dbConnect()
        await collections["carts"].drop();
        logger.debug("Se limpiaron las colecciones carts y products");
        logger.info(`Métodos del DAO de los Carritos:
        - getAllCarts()
        - getCartById(id)
        - createCart(obj)
        - emptyCart(cid)
        - updateCart(cid, pid, action)
        - updateCantCart(cid, pid, cant, action)
        - deleteCart(id)
        - deleteAllCarts()
        - purchaseCart(cid)
        `)
    });

    after( async () => {
        logger.debug('*****Fin de pruebas******');
        await dbDisconnect()
        /*
        setTimeout(() => {
            dbDisconnect()
        }, 1000);
        */
    })

    it('1. Colección de carritos "carts" vacía', async () => {
        const carts = await cartsDao.getAllCarts();

        expect(carts).to.have.lengthOf(0);
        // assert.lengthOf(carts, 0);
        // assert.strictEqual(carts.length, 0);
        // carts.should.have.lengthOf(0);
    });
    it('2. Creación de un nuevo Carrito vacío', async () => {
        const cart = await cartsDao.createCart()
        const carts = await cartsDao.getAllCarts();

        assert.equal(carts.length, 1);
        assert.equal(cart.products.length, 0);
        expect(cart).to.have.property('_id');
        expect(typeof cart === 'object').to.be.equal(true);
    });
    
    it('3. Consultar Carrito por ID', async () => {
        const cart = await cartsDao.createCart()
        const ID = cart._id.toString()

        expect(cart).to.have.property('_id');
        expect(typeof cart === 'object').to.be.equal(true);
        expect(typeof ID === 'string').to.be.equal(true);

        const result = await cartsDao.getCartById(ID)
        
        expect(!!result).to.be.equal(true);
        expect(result).to.have.property('_id');
    });

    it('4. Vaciar Carrito', async () => {
            const cart = await cartsDao.createCart(await generateDemoProds(2))
            const ID = cart._id.toString()
            expect(cart).to.have.property('_id');
            expect(cart.products.length).to.be.equal(2);            
            
            await cartsDao.emptyCart(ID)

            const cartUpdated = await cartsDao.getCartById(ID)
            
            expect(cartUpdated.products.length).to.be.equal(0);
    }); 

    it('5. Incrementar cantidad de producto solicitado en Carrito en una unidad más', async () => {
        const productsMongo = await getAllProds()
        const cant = productsMongo.length
        const obj = { products: [] }
        productsMongo.map( item => obj.products.push ( { product: item._id, quantity: Math.floor(Math.random() * item.stock) + 1 } ) )

        const cart = await cartsDao.createCart(obj)
        const ID = cart._id.toString()

        expect(cart).to.have.property('_id');
        expect(cart.products.length).to.be.equal(cant);
        await cartsDao.updateCart(ID, obj.products[0].product, '+')
        const cartUpdated = await cartsDao.getCartById(ID)
        expect(cartUpdated.products[0].quantity).to.be.equal(obj.products[0].quantity + 1);
    });
})