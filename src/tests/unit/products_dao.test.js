// SE IMPORTA EL DAO A TESTEAR Y DEBAJO LA INSTANCIA LA CLASE
import ProductsDaoMongoDB from '../../dao/mongodb/managers/products.dao.js';
const prodsDao = new ProductsDaoMongoDB()
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

// Pruebas
describe(`
========================================================================
Testing unitario del DAO de Productos - Base de datos test, Mongo Atlas
========================================================================
`, () => {

    before( async () => {
        logger.debug('*****Inicio de pruebas******');
        await dbConnect()
        await collections["products"].drop();
        logger.debug("Se limpió la colección products");
        logger.info(`Métodos del DAO de los Productos:
        - getAll()
        - getAllProducts(limit, page, sort, query)
        - getProductById(id)
        - getProductStockById(id)
        - getProductsByIds(ids)
        - createProduct(obj)
        - updateProduct(id, obj)
        - deleteProduct(id)
        - deleteAllProducts(email)
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

    it('1. Colección de Productos "products" vacía', async () => {
        const products = await prodsDao.getAll()
        
        expect(products).to.have.lengthOf(0);
        // assert.lengthOf(carts, 0);
        // assert.strictEqual(carts.length, 0);
        // carts.should.have.lengthOf(0);
    });
    it('2. Creación de un nuevo Producto', async () => {
        try {
            await createDemoProductsTestingDB()
            await prodsDao.getAll()
            const products = await prodsDao.getAll()
            const prodOBJ = products[0]
            
            expect(products).to.have.lengthOf(1);
            expect(prodOBJ).to.have.property('_id');
            expect(prodOBJ).to.have.property('code');
            expect(prodOBJ).to.have.property('stock');
            expect(prodOBJ.stock > 0).to.be.equal(true);
            expect(typeof prodOBJ === 'object').to.be.equal(true);            
        } catch (error) {
            console.log(error.message);
        }
    });
    
    it('3. Consultar Producto por ID', async () => {
        const products = await prodsDao.getAll()
        const prod = products[0].toObject()
        const ID = prod._id.toString()
        
        expect(prod).to.have.property('_id');
        expect(typeof prod === 'object').to.be.equal(true);
        expect(typeof ID === 'string').to.be.equal(true);
        
        const result = await prodsDao.getProductById(ID)
        
        expect(!!result).to.be.equal(true);
        expect(result).to.have.property('_id');
    });
})