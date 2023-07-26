//Conexión a base de datos MongoDB Atlas
import { dbConnect, dbDisconnect } from './dao/mongodb/dbconnection.js';
dbConnect()
//dbDisconnect()

// Módulo Express y puerto
import express from 'express';
const PORT = 8080;

// Módulo ruteos Express
import router_prods from './routes/products-router.js';
import router_carts from './routes/carts-router.js';
import router_views from './routes/views.router.js'

// Variable __dirname por Package.json en formato Type: module
import { __dirname } from './path.js';

// Módulo Handlebars (vistas)
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

// Llamadas de productos para invocar sus métodos
import { getAllService as prodService } from "./services/products.services.js"


// Llamadas de mensajes para invocar sus métodos
import { getAllService as msgService, createService as msgCreate } from "./services/messages.services.js"


// Definición de constante de servidor Express
const app = express();

// Configuración de servidor Express y modo de operación
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'))

// Configuración de servidor Express para Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.set('view options', {layout: 'main'});

// Incluyendo los imports de ruteos de Express
app.use('/', router_prods)
app.use('/', router_carts)
app.use('/', router_views)

// Inicialización de servicio Express
const httpServer = app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
});

// Anexo de servidor Express a servicio de WebSocket
export const socketServer = new Server(httpServer)

/* importar como app controller
// Configuración y definiciones de servicio WebSocket
socketServer.on('connection', async (socket) => {
    console.log(`Client connected: ${socket.id} // ${socket.handshake.address} // ${socket.handshake.time}`);

    // Controla cuando un cliente se desconecta y retorna mensaje
    socket.on('disconnect', () => {
        console.log('Client disconnected!');
    })

    // Revisa si el cliente conectado envia el evento "msg1" y lo muestra
    socket.on('msg1', (message) => {
        console.log( message );
    })

    // Envía evento "msg1" al cliente conectado
    socket.emit('msg1', 'Connected to server!!')

    
    socket.on('http:ProductsModified', async () => {
        try {
            socketServer.emit('products', await prodService())
        } catch (error) {
            console.log(error);
        }
    })
    
    // Envía el evento "products" a todos los clientes conectados y les pasa la función de todos los productos
    socketServer.emit( 'products', await prodService() );
    
    // Envía el evento "products" a todos los clientes conectados (excepto a sí mismo) y les pasa la función de todos los productos
    // socketServer.broadcast.emit('products', productManager.getProducts())
    
    // Envía el evento "messages" a todos los clientes conectados y les pasa la función de todos los mensajes
    socketServer.emit('messages', await msgService() );
    
    // Registra el evento "newUser" y el servidor registra por console.log el nuevo usuario conectado
    socket.on('newUser', (user)=>{
        console.log(`${user} is logged in`);
    });
    
    
    // Registra el evento "chat:message" y envía el nuevo mensaje incorporado por otro usuario a todos
    socket.on('chat:message', async (msg)=>{
        await msgCreate(msg);
        socketServer.emit('messages', await msgService());
    });
    
    // Registra el evento "newUser" y el servidor envía al chat a todos los usuarios del nuevo usuario conectado (excepto a sí mismo)
    socket.on('newUser', (user)=>{
        socket.broadcast.emit('newUser', user);
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
*/