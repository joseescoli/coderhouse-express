import bcrypt from 'bcrypt';
import { fakerES as faker } from "@faker-js/faker";
// import { faker } from "@faker-js/faker";
// faker.locale = "es";


/**
 * Función para la encripción de la contraseña con el módulo "bcrypt" usando el método hashSync. 
 * Recibe contraseña sin encriptar y retorna la contraseña encriptada
 * @param password String
 * @returns Retorna contraseña encriptada/hasheada
 */
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/**
 * 
 * @param {*} password 1° parámetro recibe contraseña sin encriptar.
 * @param {*} user 2° parámetro recibe contraseña almacenada en base de datos (hasheada).
 * @returns boolean
 */
export const isValidPassword = (password, dbpass) => bcrypt.compareSync(password, dbpass);

export const detectBrowser = (agent) => {
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
}

// Fuente de https://gist.github.com/solenoid/1372386
const mongoObjectId = () => {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

const mockProduct = () => ({
    _id: mongoObjectId(),
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
  
  export const createProductsMocking = (count = 100) =>
    Array.from({ length: count }, mockProduct);