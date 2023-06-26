import { Router } from 'express'
const router = Router();
import { __dirname } from '../path.js';

import ProductManager from '../manager/ProductManager.js';
import fieldValidator from '../middlewares/fieldValidator.js';
const productManager = new ProductManager( __dirname + '/fs/products.json');

router.get('/api/products', async(req, res) => {
    try {
        const limit = Number(req.query.limit) || 0
        if ( isNaN(limit) )
            res.status(400).json({ message: 'limit param must be a number!' })
        else {

            let products = productManager.getProducts()
            
            if ( limit ) {
                products = products.slice(0,limit)
            }

            if(products.length){
                res.status(200).json({ message: 'Products found', products })
                // res.status(200).json(product)
            } else {
                res.status(400).send('Products not found')
            }
        }
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/api/products/:pid', async(req, res) => {
    try {
        const id = Number(req.params.pid);
        if ( isNaN(id) )
            res.status(400).json({ message: 'Product ID must be a number!' })
        else {
            const product = await productManager.getProductById(id);
            if(product){
                res.status(200).json({ message: 'Product found', product })
                // res.status(200).json(product)
            } else {
                res.status(400).send('Product not found')
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.post('/api/products', fieldValidator , async (req, res)=>{
    try {
        const { title, description, code, price, stock, category } = req.body
        const thumbnails = String([...req.body.thumbnails]) || []

        const product = { title, description, code, price, stock, category, thumbnails }

        const newProduct = productManager.addProduct(product);
        if(newProduct)
            res.status(200).json("Product added!");
        else
            res.status(404).json({ message: "Invalid product!" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put('/api/products/:pid', async(req, res) => {
    try {
        const pid = Number(req.params.pid);
        if ( isNaN(pid) )
            res.status(400).json({ message: 'Product ID must be a number!' })
        else {
            const product = { id: pid, ...req.body };
            const update = await productManager.updateProduct(product);
            if(update)
                res.send(`Product updated successfully!`)
            else
                res.status(404).send('Product not found')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

router.delete('/api/products/:pid', async(req, res)=>{
    try {
        const pid = Number(req.params.pid);
        if ( isNaN(pid) )
            res.status(400).json({ message: 'Product ID must be a number!' })
        else {
            const prodDel = productManager.deleteProduct(pid);
            if(prodDel)
                res.send(`Product ID: ${pid} deleted successfully`)
            else
                res.send(`Product ID: ${pid} not found`)
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

router.delete('/api/products', async(req, res)=>{
    try {
        await productManager.deleteAllProducts();
        res.send('Products deleted successfully')
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
})

export default router;