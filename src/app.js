import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productManager = new ProductManager('./products.json');
/*
app.get('/products', async(req, res) => {
    try {
        const products = productManager.getProducts()
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
});
*/
app.get('/products', async(req, res) => {
    try {
        const limit = Number(req.query.limit) || 0
        let products = productManager.getProducts()
        
        if ( limit ) {
            products = productManager.getProducts().slice(0,limit)
        }

        if(products){
            res.status(200).json({ message: 'Products found', products })
            // res.status(200).json(product)
        } else {
            res.status(400).send('Products not found')
        }
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.get('/products/:id', async(req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await productManager.getProductById(id);
        if(product){
            res.status(200).json({ message: 'Product found', product })
            // res.status(200).json(product)
        } else {
            res.status(400).send('Product not found')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
});