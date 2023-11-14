// Se incorpora "supertest" como módulo seleccionado para el testing
import request from 'supertest';
// El módulo supertest requiere acceder a la app de express exportada para utilizarse para las pruebas de endpoints
import app from '../../server.js';

// import { isValidPassword } from '../../utils/utils.js';

// Se incorporan los logs
import { logger } from '../../utils/logger.js';

// Módulo collections para manipular las colecciones de Mongo
import pkg from 'mongoose';
const { connection } = pkg;
const { collections } = connection

// import UserDao from '../../dao/mongodb/managers/user.dao.js';
// const userDao = new UserDao()

const user = {
    first_name: 'TEST',
    last_name: 'Integración',
    email: 't@t.com',
    age: 10,
    password: 'test',
    role: 'admin'
}

// Pruebas
describe(`
========================================================================
Testing Integral endpoint Productos - Base de datos test, Mongo Atlas
========================================================================
`, () => {
    beforeAll( async () => {
        try {
            logger.debug('*****Inicio de pruebas******');
            logger.debug("Se limpia la colección 'users'");
            collections['users'].drop();
            /*
            await collections['products'].drop();
            collections['carts'].drop();
            collections['messages'].drop();
            collections['sessions'].drop();
            collections['tickets'].drop();
            collections['tokens'].drop();
            */
        } catch (error) {
            console.log(error.message);
        }
    });

    test('[POST] /register', async () => {
            request(app).post('/register').send(user).then ( response => {
                // console.log("RESPONSE: " + JSON.stringify(response.body));
                // console.log("RESPONSE: " + response.text.data);
                // const id = response.body.data.session.passport.user;
                // const userMongo = await userDao.getById(id)
                
                expect(response.statusCode).toBe(200)
                // expect(id).toBeDefined();
                expect(response.body.data.msg).toBe('Register ok')
        
                // expect(response.body.data.passport).toHaveProperty('user');
                // expect(userMongo._id.toString()).toBe(id)
                // expect(userMongo.first_name).toBe(user.first_name)
                // expect(userMongo.last_name).toBe(user.last_name)
                // expect(userMongo.email).toBe(user.email)
                // expect(userMongo.age).toBe(user.age)
                // expect(isValidPassword(user.password, userMongo.password)).toBe(true)
                // expect(userMongo.role).toBe(user.role)
            })
    })
    
    test('[POST] /login', async () => {
        const userLogin = {
            email: user.email,
            password: user.password
        }
        const response = await request(app).post('/login').send(userLogin);
        expect(response.statusCode).toBe(200);
        
    });
    
    /*
    test('[GET-ID] /api/products/:id', async () => {
        const prod = await createDemoProductsTestingDB()
        const response = await request(app).post('/api/products').send(prod);
        const titleResponse = response.body.title;
        expect(response.statusCode).toBe(200);
        const id = response.body._id;
        expect(id).toBeDefined();
        expect(response.body).toHaveProperty('_id');
        const responseGetById = await request(app).get(`/api/products/${id}`);
        expect(responseGetById.statusCode).toBe(200);
        expect(titleResponse).toBe(responseGetById.body.title);

        const idFail = '65371455a4f446f3d0566660';
        const GetByIdFail = await request(app).get(`/api/products/${idFail}`);
        const responseGetFail = GetByIdFail.body.message;
        const msgErrorApi = `Wrong information provided`
        expect(GetByIdFail.statusCode).toBe(400);
        expect(responseGetFail).toEqual(msgErrorApi);

    })

    test('[PUT] /api/products/:id', async () => {
        const prod = await createDemoProductsTestingDB()
        const response = await request(app).post('/api/products').send(prod);
        const idPost = response.body._id;
        expect(idPost).toBeDefined();

        const prodUpd = {
            ...prod,
            title: 'title updated'
        };
        const responsePut = await request(app).put(`/api/products/${idPost}`).send(prodUpd);
        const idPut = responsePut.body._id;
        expect(idPut).toBeDefined();
        expect(responsePut.statusCode).toBe(200);
    })

    test('[DELETE] /api/products/:id', async () => {
        const prod = await createDemoProductsTestingDB()
        const response = await request(app).post('/api/products').send(prod);
        const idPost = response.body._id;
        expect(idPost).toBeDefined();

        const responseDel = await request(app).delete(`/api/products/${idPost}`);
        expect(responseDel.statusCode).toBe(200);
        const responseGetById = await request(app).get(`/api/products/${response.body._id}`);
        const responseGetFail = responseGetById.body.message;
        const msgErrorApi = `Wrong information provided`
        expect(responseGetById.statusCode).toBe(400);
        expect(responseGetFail).toEqual(msgErrorApi);
    })
    */
})