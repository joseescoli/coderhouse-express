import { Router } from 'express'
const router = Router();
import { __dirname } from '../path.js';

import CartManager from '../manager/CartManager.js';
const cartManager = new CartManager( __dirname + '/fs/carts.json');

// Ruta TESTING todos los carritos
router.get('/api/carts', async(req, res) => {
    try {
        const carts = cartManager.getCarts()
        
        if(carts.length){
            res.status(200).json({ message: 'Carts found', carts })
            // res.status(200).json(carts)
        } else {
            res.status(400).send('Carts not found')
        }
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Ruta por ID de carrito
router.get('/api/carts/:cid', async(req, res) => {
    try {
        const cid = Number(req.params.cid);
        if ( isNaN(cid) )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        else {
            const cart = await cartManager.getCartById(cid)
            if (cart)
                res.status(200).json({ message: 'Cart found', cart })
            else
                res.status(400).send('Cart not found')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Alta de nuevo carrito
router.post('/api/carts', async (req, res)=>{
    try {
            const cart = cartManager.addCart()
            if(cart)
                res.status(200).json("Cart added!");
            else
                res.status(400).json({ message: "Invalid cart!" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Alta o sumatoria de nuevo producto en carrito preexistente
router.post('/api/carts/:cid/product/:pid', async (req, res)=>{
    try {
        const cid = Number(req.params.cid);
        const pid = Number(req.params.pid);
        if ( isNaN(cid) )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        if ( isNaN(pid) )
            res.status(400).json({ message: 'Product ID must be a number!' })

        if ( !isNaN(cid) && !isNaN(pid)){
            const newCart = cartManager.updateCart(cid, pid, "add");
            if(newCart)
                res.status(200).json("Product added to cart!");
            else
                res.status(400).json({ message: "Invalid cart or product!" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Borrado de producto en carrito preexistente
router.delete('/api/carts/:cid/product/:pid', async (req, res)=>{
    try {
        const cid = Number(req.params.cid);
        const pid = Number(req.params.pid);
        if ( isNaN(cid) )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        if ( isNaN(pid) )
            res.status(400).json({ message: 'Product ID must be a number!' })

        if ( !isNaN(cid) && !isNaN(pid)){
            const newCart = cartManager.updateCart(cid, pid, "remove");
            if(newCart)
                res.status(200).json("Product removed from cart!");
            else
                res.status(400).json({ message: "Invalid cart or product!" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/api/carts/:cid', async(req, res)=>{
    try {
        const pid = Number(req.params.cid);
        if ( isNaN(cid) )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        else {
            const cartDel = cartManager.deleteCart(cid);
            if(prodDel)
                res.send(`Cart ID: ${cid} deleted successfully`)
            else
                res.send(`Cart ID: ${cid} not found`)
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

export default router;