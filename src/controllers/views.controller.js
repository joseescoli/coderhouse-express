// Incorporación de capa de servicios de Productos
import { getAllService } from "../services/products.services.js";

import config from "../config.js";

// Función de detección de usuario interactivo o API (Navegador, API o consulta de endpoint)
import { detectBrowser } from "../utils.js";

export const listAllProdsView = async (req, res) => {
    try {

        // Se valida si el usuario está autenticado
        if ( req.session?.user?.info ) {
            console.log(`User ${req.session.user.info.email} logged in!`);

            const limit = req.query.limit ? Number(req.query.limit) : 2     // Definición de resultados por página
            const page = req.query.page ? Number(req.query.page) : 1        // Definición de página inicial

            // Se comprueba que las constantes estén cargadas con números. De lo contrario se arroja advertencia
            if ( isNaN(limit) || isNaN(page) ) {
            res.status(400).json({
                status: 'Error',
                error: 'limit/page params must be a number!',
                message: error.message

            }) } 
            else {

                // Se consulta de la base de datos todos los resultados en propiedad 'products.docs'. El resto de las propiedades retornan estadísticas y paginado
                const products = await getAllService(limit, page, null, null)

                let url = `http://${req.hostname}:${config.PORT || 8080}/?`
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
                        last_name: req.session.user.info.last_name,
                        cart: req.session.user.info.cart
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
        const io = req.app.get("io");
        io.emit('user_logged', req.session.user.info.email);
        res.render('chat', {layout: 'chat-main', user: req.session.user.info.email})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const pageNotFoundView = async (req, res) => {
    try {
        detectBrowser(req.get('User-Agent')) ? res.status(404).render('404') : res.status(404).send( '[404] - Page not found!' )
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error);
    }
};