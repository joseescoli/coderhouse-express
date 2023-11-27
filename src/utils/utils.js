import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { fakerES as faker } from "@faker-js/faker";
// import { faker } from "@faker-js/faker";
// faker.locale = "es";
import { randomBytes } from 'crypto';

import config from '../config.js';

import { getAllProds, createService } from '../services/products.services.js';

// https://bobbyhadz.com/blog/delete-all-files-in-a-directory-using-node-js
import { __dirname } from '../path.js';
import { rmSync } from 'fs';

export const deleteFilesInDir = (id, paths) => {
    /*
    Lectura de archivos de directorio y borrado individual
    readdirSync(paths).forEach( file => {
        rmSync(__dirname.join(paths, file))
    })
    */
    /*
    Eliminación de archivos indicados en paths
    rmSync(paths, {recursive: true, force: true}, err => {
        if(err) throw err
    })
    */

    // Eliminación de carpetas desde carpeta padre y recursivas
    const folder = `${__dirname}/data/documents/${id}`
    rmSync(folder, {recursive: true, force: true}, err => {
        if(err) throw err
    })

    // Eliminación de carpeta products en caso de haberse subido por el usuario
    if ( paths.includes('products') ) {
        const folder = `${__dirname}/data/images/products/${id}`
        rmSync(folder, {recursive: true, force: true}, err => {
            if(err) throw err
        })
    }
    // Eliminación de carpeta profiles en caso de haberse subido por el usuario
    if ( paths.includes('profiles') ) {
        const folder = `${__dirname}/data/images/profiles/${id}`
        rmSync(folder, {recursive: true, force: true}, err => {
            if(err) throw err
        })
    }
}

export const resetToken = async () => randomBytes(32).toString('hex');
/**
 * Función para la encripción de la contraseña con el módulo "bcrypt" usando el método hashSync. 
 * Recibe contraseña sin encriptar y retorna la contraseña encriptada
 * @param password String
 * @returns Retorna contraseña encriptada/hasheada
 */
export const createHash = password => hashSync(password, genSaltSync(10));

/**
 * 
 * @param {*} password 1° parámetro recibe contraseña sin encriptar.
 * @param {*} user 2° parámetro recibe contraseña almacenada en base de datos (hasheada).
 * @returns boolean
 */
export const isValidPassword = (password, dbpass) => compareSync(password, dbpass);

export const detectBrowser = (agent) => {
    if ( !config.TESTING ) {
        if(agent.match(/chrome|chromium|crios/i)){
            return "chrome";
        }else if(agent.match(/firefox|fxios/i)){
            return "firefox";
        }  else if(agent.match(/safari/i)){
            return "safari";
        }else if(agent.match(/opr\//i)){
            return "opera";
        } else if(agent.match(/edg/i)){
            return "edge";
        }else{
            return false;
        }
    } else return false;
}

// Fuente de https://gist.github.com/solenoid/1372386
const mongoObjectId = () => {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

const mockProduct = () => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    // price: faker.commerce.price(),
    price: faker.number.int({ min: 50, max: 1000 }),
    category: faker.commerce.department(),
    code: 'M' + faker.number.int({ min: 1, max: 1000 }),
    stock: faker.number.int({ min: 0, max: 500 }),
    status: faker.datatype.boolean(),
    thumbnails: Array.from({ length: 3 }, () => faker.image.url()),
  });

const mockProductMongoID = () => ({
    _id: mongoObjectId(),
    ...mockProduct()
  });
  
  export const createProductsMocking = (count = 1) =>
    Array.from({ length: count }, mockProductMongoID);

  export const createProductsMockNoID = (count = 1) =>
    Array.from({ length: count }, mockProduct);

  export const createDemoProductsTestingDB = async (count = 1) => {
    const prods = Array.from({ length: count }, mockProduct);
    if ( config.TESTING )
        prods.forEach( async item => await createService(item) )
    const products = await getAllProds()
    const obj = products.map( item => item.toJSON() )
    return obj
  }