const SocketClient = io()

SocketClient.on('msg1', (message) => {
    console.log( message );

    // SocketClient.emit('msg1', 'New client!')
})

/* El código debajo no fue necesario incorporarlo debido a la instalación del módulo "socket.io-client"
Definiendo dentro del router de productos las dos sentencias debajo se puede emitir eventos desde el mismo router ante un HTTP GET, POST, etc.
import { io } from 'socket.io-client';
const socket = io()

Con la siguiente sentencia se emite el mensaje a capturar por el servidor:
socket.io.emit('http:post:newProduct')

Debajo hasta el cierre del comentario, todo el código que ya no es necesario desde el formulario de la vista "form"
// Relación entre el formulario de la vista websocket y los campos
const form = document.getElementById('form');
const inputName = document.getElementById('name');
const inputPrice = document.getElementById('price');
const products = document.getElementById('products');

// Envía evento al servidor "newProduct" para actualizar los productos
form.onsubmit = (e) => {
    e.preventDefault();
    const name = inputName.value;
    const price = inputPrice.value;
    SocketClient.emit('newProduct', { title: name, price });
}
*/

// Recibe evento del servidor "products" para actualizar la etiqueta <p> de la vista realtimeProducts con los productos

// Relación entre el formulario de la vista realTimeProducts y la etiqueta <p> con ID=products
const productlist = document.getElementById('products');

SocketClient.on('products', (list) => {

    let infoProducts = '';
    list.forEach((prod) => {
        infoProducts += `Product: ${prod.title}<br>Price: ${prod.price}<br><br>`
    })
    productlist.innerHTML = infoProducts
    console.log( "Products received from server!" );

})