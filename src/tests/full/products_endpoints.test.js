// Se incorpora "supertest" como módulo seleccionado para el testing
import request from 'supertest';
// El módulo supertest requiere acceder a la app de express exportada para utilizarse para las pruebas de endpoints
import app from '../../server.js';

// Se incorporan los logs
import { logger } from '../../utils/logger.js';

// Módulo collections para manipular las colecciones de Mongo
import pkg from 'mongoose';
const { connection } = pkg;
const { collections } = connection

// Servicios de productos DEMO
import { createProductsMockNoID } from '../../utils/utils.js';

// Pruebas
describe(`
========================================================================
Testing Integral endpoint Productos - Base de datos test, Mongo Atlas
========================================================================
`, () => {
    beforeAll( async () => {
        try {
            logger.debug('*****Inicio de pruebas******');
            logger.debug("Se limpia la colección 'products'");
            await collections['products'].drop();
            /*
            collections['carts'].drop();
            collections['messages'].drop();
            collections['sessions'].drop();
            collections['tickets'].drop();
            collections['tokens'].drop();
            collections['users'].drop();
            */
        } catch (error) {
            console.log(error.message);
        }
    });

    test('[POST] /api/products', async () => {
            const prod = createProductsMockNoID()
            // console.log("PROD: " + JSON.stringify(prod[0]));
            const response = await request(app).post('/api/products').send(prod[0]);
            // const response = await userSession.post('/api/products').send(prod[0]);
            // console.log("RESPONSE: " + JSON.stringify(response.body));
            // console.log("RESPONSE: " + response.text.data);
            const id = response.body.data._id;
            const titleResponse = response.body.data.title;
            
            expect(response.statusCode).toBe(200);
            expect(id).toBeDefined();
            expect(response.body.data).toHaveProperty('_id');
            expect(titleResponse).toBe(prod[0].title)
    });
/*
    test('[GET-ALL] /api/products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(1);
    });

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