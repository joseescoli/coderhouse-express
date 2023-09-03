import { getAllService } from "../services/products.services.js";
import { createService } from "../services/carts.services.js";

import { detectBrowser } from "../utils.js";

export const listAllProdsView = async (req, res) => {
    try {

        if ( req.session?.user ) {

            const limit = req.query.limit ? Number(req.query.limit) : 2
            const page = req.query.page ? Number(req.query.page) : 1

            if ( isNaN(limit) || isNaN(page) ) {
            res.status(400).json({
                status: 'Error',
                error: 'limit/page params must be a number!',
                message: error.message

            }) } 
            else {

                const products = await getAllService(limit, page, null, null)

                let url = `http://${req.hostname}:${req.app.get("port")}/?`
                //url += req.url
                
                let prevLink = (products.hasPrevPage)? `${url + 'page='+products.prevPage}` : null
                let nextLink = (products.hasNextPage)? `${url + 'page='+products.nextPage}` : null

                let url2 = ''
                
                if ( req.query.limit ) `${url2+='&limit='+limit}`

                prevLink = prevLink ? prevLink += url2 : null
                nextLink = nextLink ? nextLink += url2 : null

                //console.log(req.session);
                
                if(products.totalDocs){

                    const responseObject = {
                        products: products.docs.map(item => item.toJSON()),
                        totalPages: products.totalPages,
                        records: products.totalDocs,
                        prevPage: products.prevPage,
                        nextPage: products.nextPage,
                        page: products.page,
                        hasPrevPage: products.hasPrevPage?true:false,
                        hasNextPage: products.hasNextPage?true:false,
                        prevLink: prevLink,
                        nextLink: nextLink,
                        homeLink: url + 'page=1',
                        first_name: req.session.user.info.first_name,
                        last_name: req.session.user.info.last_name
                    }

                    detectBrowser(req.get('User-Agent')) ? res.render( 'home', responseObject ) : res.json( responseObject )

                } else {
                    res.status(400).json({
                        status: 'Error',
                        error: 'Products not found'
                        //message: error.message
                    })
                }
            }
        } else
            res.redirect('/login')
        
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

export const currentSession = async (req, res) => {
    try {
        if ( req.session?.user )
            res.status(200).json({status: 'active', session: req.session.user.info})
        else
            res.status(401).json({status: 'false', session: 'Not logged in'})
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