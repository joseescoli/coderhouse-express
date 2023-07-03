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
import ProductManager from './manager/ProductManager.js';
const productManager = new ProductManager(__dirname + '/fs/products.json');
const products = productManager.getProducts()

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
const socketServer = new Server(httpServer)

// Configuración y definiciones de servicio WebSocket
socketServer.on('connection', (socket) => {
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

    // Envía el evento "products" a todos los clientes conectados y les pasa la función de todos los productos
    socketServer.emit('products', products);

    socket.on('http:ProductsModified', () => {
        socketServer.emit('products', products)
    })
    
    // Envía el evento "products" a todos los clientes conectados (excepto a sí mismo) y les pasa la función de todos los productos
    // socketServer.broadcast.emit('products', productManager.getProducts())
})