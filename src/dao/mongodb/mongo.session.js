import MongoStore from 'connect-mongo';
import { connectionString } from './dbconnection.js';

// Definición de alamacenamiento de sesiones en MongoDB
export const mongoStoreOption = {
    store:MongoStore.create({
            mongoUrl: connectionString,
            crypto:{
                secret: '1234'
            }
        }),
    secret:'1234',
    resave: false,
    saveUninitialized: false,
    cookie:{ maxAge: 1800000 } // 30 minutos

}