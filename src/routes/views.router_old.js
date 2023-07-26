import { Router } from 'express'
const router = Router();
import { __dirname } from '../path.js';
import ProductManager from '../manager/ProductManager.js';
const productManager = new ProductManager( __dirname + '/fs/products.json');

router.get('/', async(req, res) => {
    try {
            const products = productManager.getProducts()
                // res.status(200).json({ message: products.length===1 ? products.length + ' Product found': products.length + ' Products found', products })
                res.render('home', {products})
                // res.redirect(`/home/${products.id}`);
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/api', async(req, res) => {
    try {
        res.status(200).render('apis')
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
});

router.get('/realtimeproducts', async(req, res) => {
    try {
        res.render('realTimeProducts')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/chat', async(req, res) => {
    try {
        res.render('chat', {layout: 'chat-main'})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('*', async(req, res) => {
    try {
        res.status(404).render('404')
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
});

export default router;