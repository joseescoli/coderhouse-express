import MongoStore from 'connect-mongo';
import { connectionString } from './dbconnection.js';
import config from '../../config.js';

// Definición de almacenamiento de sesiones en MongoDB
export const mongoStoreOption = {
    store:MongoStore.create({
            mongoUrl: connectionString,
            crypto:{
                secret: config.MONGO_STORE_SESSION_URL_SECRET
            }
        }),
    secret: config.MONGO_STORE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{ maxAge: Number(config.MONGO_STORE_COOKIE_SESSION_MAXAGE) || 1800000 } // Definición desde variable de entorno o por defecto 30 minutos

}