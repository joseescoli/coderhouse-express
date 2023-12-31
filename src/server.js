// Configuración general del servidor en variables de entorno
import config from './config.js';
process.title = config.APP_TITLE

// Incorporación de winston como logger
import { logger } from './utils/logger.js';
// Incorporación de winston como logger middleware HTTP
import { loggerHTTP } from './middlewares/loggerHttp.js';

// Conexión a base de datos MongoDB Atlas
import { dbConnect } from './dao/mongodb/dbconnection.js';
dbConnect()

// Módulo de sesiones
import session from 'express-session';

// Definición de almacenamiento de sesiones en MongoDB
import { mongoStoreOption } from './dao/mongodb/mongo.session.js'

// Módulos Passport, Passport Local y Passport Github con sus definiciones de estrategias de autenticación
import passport from 'passport';
import './passport/local-strategy.js';
import './passport/github-strategy.js';

// Módulo Express y puerto en config.PORT
import express from 'express';

// Variable __dirname por Package.json en formato Type: module
import { __dirname } from './path.js';

// Módulo Handlebars (vistas)
import handlebars from 'express-handlebars';

// Módulo WebSocket
import { Server } from 'socket.io';

// Llamadas de productos para invocar sus métodos
import { getAllProds as prodService } from "./services/products.services.js"

// Llamadas de mensajes para invocar sus métodos
import { getAllService as msgService, createService as msgCreate } from "./services/messages.services.js"

// Incorporación de módulo de documentación Swagger
import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

// Definición de constante de servidor Express
const app = express();

// Incorporación de definición de configuración Swagger
import { info } from './docs/info.js'
const specs = swaggerJSDoc(info)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));


// Configuración de servidor Express y modo de operación
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'))
app.use(session(mongoStoreOption));
// Middleware de manejo de errores
import { errorHandler } from './middlewares/errorHandler.js'
app.use(errorHandler);

// Middleware de logger http y agregado de logger a express en "req.logger"
app.use(loggerHTTP)

// Incluyendo módulos Passport, Passport Local y Passport Github a Express
app.use(passport.initialize());
app.use(passport.session());

// Módulo ruteos Express
import AllRoutes from './routes/routes.js';
const allRoutes = new AllRoutes()

// Configuración de servidor Express para Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.set('view options', {layout: 'main'});

// Incluyendo los imports de ruteos de Express
app.use('/', allRoutes.getRoutes())

// Inicialización de servicio Express
const httpServer = app.listen(config.PORT, ()=>{
    logger.debug(`Server started at port: ${config.PORT}`);
});

// Anexo de servicio de WebSocket a servidor Express
const socketServer = new Server(httpServer)

// Se define la variable "io" para todo express y ser usada luego dentro de "products.controller.js" como constante y llamar a req.app.get("io") y poder emitir cambios por socket como servidor
app.set("io", socketServer)

// Configuración y definiciones de servicio WebSocket
socketServer.on('connection', async (socket) => {
    logger.debug(`Client connected: ${socket.id} // ${socket.handshake.address} // ${socket.handshake.time}`);

    // Controla cuando un cliente se desconecta y retorna mensaje
    socket.on('disconnect', () => {
        logger.debug('Client disconnected!');
    })

    // Revisa si el cliente conectado envia el evento "msg1" y lo muestra
    socket.on('msg1', (message) => {
        logger.debug( message );
    })

    // Envía evento "msg1" al cliente conectado
    socket.emit('msg1', 'Connected to server!!')


    let products = await prodService()
    products = products.map(item => item.toJSON())

    // Envía el evento "products" a todos los clientes conectados y les pasa la función de todos los productos
    socketServer.emit( 'products', products );
    
    // Envía el evento "products" a todos los clientes conectados (excepto a sí mismo) y les pasa la función de todos los productos
    // socketServer.broadcast.emit('products', productManager.getProducts())
    
    // Envía el evento "messages" a todos los clientes conectados y les pasa la función de todos los mensajes
    socketServer.emit('messages', await msgService() );
    
    // Registra el evento "chat:message" y envía el nuevo mensaje incorporado por otro usuario a todos
    socket.on('chat:message', async (msg)=>{
        await msgCreate(msg);
        socketServer.emit('messages', await msgService());
    });
        
    // Registra el evento "chat:typing" y el servidor envía al chat a todos los usuarios el usuario que está escribiendo (excepto a sí mismo)
    socket.on('chat:typing', (data)=>{
        socket.broadcast.emit('chat:typing', data);
    })

    // Registra el evento "chat:typing:stop" y el servidor borra en el chat de todos los usuarios la leyenda que un usuario está escribiendo (excepto a sí mismo)
    socket.on('chat:typing:stop', () => {
        socket.broadcast.emit('chat:typing:stop');
    })

})

// Se exporta constante para el uso de pruebas con jest
export default app;