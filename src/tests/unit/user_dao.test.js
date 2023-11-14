// SE IMPORTA EL DAO A TESTEAR Y DEBAJO LA INSTANCIA LA CLASE
import UserDao from "../../dao/mongodb/managers/user.dao.js"
const userDao = new UserDao();

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

// Pruebas
describe(`
========================================================================
Testing unitario del DAO de Carritos - Base de datos test, Mongo Atlas
========================================================================
`, () => {

    before( async () => {
        logger.debug('*****Inicio de pruebas******');
        await dbConnect()
        await collections["users"].drop();
        logger.debug("Se limpió la colección users");
        logger.info(`Métodos del DAO del Usuario:
        - getall()
        - registerUser(user)
        - loginUser(user)
        - getById(id)
        - getByEmail(email)
        - newCart(email)
        - passChange(id, pass)
        - changeRoleById(id)
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

    it('1. Colección de Usuarios "users" vacía', async () => {
        const users = await userDao.getall()

        expect(users).to.have.lengthOf(0);
    });
    it('2. Creación de un nuevo Usuario', async () => {
        const userMock = {
            first_name: 'NAME',
            last_name: 'LASTNAME',
            email: 'test@test.com',
            age: 10,
            password: 'TEST_pass',
            cart: null,
            role: 'user',
            githubLogin: false,
            profileImg: null
        }
        await userDao.registerUser(userMock)
        const user = await userDao.getall()
        const user1 = user[0]

        assert.equal(user.length, 1);
        expect(user1).to.have.property('_id');
        expect(typeof user1 === 'object').to.be.equal(true);
        expect(user1.email).to.be.equal(userMock.email);
    });
    
    it('3. Consultar User por ID', async () => {
        const user = await userDao.getall()
        const ID = user[0]._id.toString()
        const user1 = user[0]

        expect(user1).to.have.property('_id');
        expect(typeof user1 === 'object').to.be.equal(true);
        expect(typeof ID === 'string').to.be.equal(true);

        const result = await userDao.getById(ID)
        
        expect(!!result).to.be.equal(true);
        expect(result).to.have.property('_id');
    });
})