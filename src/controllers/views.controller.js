import { getAllProds } from "../services/products.services.js";

export const listAllProdsView = async (req, res) => {
    try {
            const products = await getAllProds()
            //res.status(200).json({ message: products.length===1 ? products.length + ' Product found': products.length + ' Products found', products })
            res.render( 'home', {products: products.map(item => item.toJSON())} )
            // res.redirect(`/home/${products.id}`);
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const listAllApisView = async (req, res) => {
    try {
        res.status(200).render('apis')
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};

export const listAllProdsRealtimeView = async (req, res) => {
    try {
        res.render('realTimeProducts')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const chatView = async (req, res) => {
    try {
        res.render('chat', {layout: 'chat-main'})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const pageNotFoundView = async (req, res) => {
    try {
        res.status(404).render('404')
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};