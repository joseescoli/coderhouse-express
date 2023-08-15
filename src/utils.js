import bcrypt from 'bcrypt';

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