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