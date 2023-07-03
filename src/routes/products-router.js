import { Router } from 'express'
const router = Router();
import { __dirname } from '../path.js';

import ProductManager from '../manager/ProductManager.js';
const productManager = new ProductManager( __dirname + '/fs/products.json');
import fieldValidator from '../middlewares/fieldValidator.js';
import { io } from 'socket.io-client';
const socket = io()

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
                res.status(200).json({ message: products.length===1 ? products.length + ' Product found': products.length + ' Products found', products })
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
        const thumbnails = []

        if ( req.body.thumbnails )
            thumbnails.push(...req.body.thumbnails)
        
        const product = { title, description, code, price, stock, category, thumbnails }

        const newProduct = await productManager.addProduct(product);
        if(newProduct) {
            res.status(200).json("Product added!");
            socket.io.emit('http:ProductsModified')
        }
        else
            res.status(404).json({ message: "Invalid product attributes. Verify all fields are complete and avoid duplicate code!. [Fields required: title, description, price, code, stock, category]" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put('/api/products/:pid', async(req, res) => {
    try {
        if ( !req.params.pid )
            res.status(400).json({ message: 'Product ID error or not defined in URL!' })
        else {
            if ( isNaN( Number( req.params.pid) ) )
                res.status(400).json({ message: 'Product ID must be a number!' })
            else {
                const pid = Number(req.params.pid)
                const updateFields = {}
                if ( req.body.title) updateFields.title = String(req.body.title)
                if ( req.body.description) updateFields.description = String(req.body.description)
                if ( req.body.code) updateFields.code = String(req.body.code)
                if ( req.body.price) updateFields.price = parseFloat(req.body.price)
                if ( req.body.stock ) updateFields.stock = Number(req.body.stock)
                if ( req.body.category ) updateFields.category = String(req.body.category)
                if ( req.body.thumbnails )
                    if ( typeof req.body.thumbnails === 'string')
                        updateFields.thumbnails.push(req.body.thumbnails)
                        else if ( updateFields.thumbnails.constructor.name === 'Array')
                            updateFields.thumbnails = req.body.thumbnails

                const product = { id: pid, ...updateFields };
                const update = await productManager.updateProduct(product);
                if(update) {
                    const fields = Object.keys(updateFields).length
                    res.send(`Product updated successfully! ${fields} ${fields === 1 ? ' attribute changed.' : ' attributes changed.'}`)
                    socket.io.emit('http:ProductsModified')
                }
                else
                    res.status(404).send('Product not found or duplicate product code')
            }
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
            if(prodDel) {
                res.send(`Product ID: ${pid} deleted successfully`)
                socket.io.emit('http:ProductsModified')
            }
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
        socket.io.emit('http:ProductsModified')
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
})

export default router;