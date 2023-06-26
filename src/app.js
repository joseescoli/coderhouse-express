import express from 'express';
import router_prods from './routes/products-router.js';
import router_carts from './routes/carts-router.js';
import { __dirname } from './path.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'))

app.use('/', router_prods)
app.use('/', router_carts)

app.get('/', async(req, res) => {
    try {
        res.status(200).send("<h1>JSON Express server!</h1><h2>List of APIs</h2><ul><li>/api/carts/[ID] = Cart ID</li><li>/api/products = List of products</li><li>/api/products/[ID] = Product ID</li><ul>");
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
});

app.get('*', async(req, res) => {
    try {
        res.status(404).send("<h1>HTTP Error - 404</h1><p>Page not found</p>");
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
});

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
});