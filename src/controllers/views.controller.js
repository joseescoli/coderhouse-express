// Incorporación de capa de servicios de Productos
import { getAllService } from "../services/products.services.js";

import UserDao from "../dao/mongodb/managers/user.dao.js";
const userDao = new UserDao()

// Incorporación de variables de entorno
import config from "../config.js";

// Función de detección de usuario interactivo o API (Navegador, API o consulta de endpoint)
import { detectBrowser } from "../utils/utils.js";

import { HttpResponse } from "../utils/http.responses.js";
const httpResponse = new HttpResponse()
import errorsConstants from "../utils/errors/errors.constants.js";

export const listAllProdsView = async (req, res) => {
    try {
            req.logger.debug(`User ${req.session.user.info.email} logged in!`);

            const cart = ( await userDao.getById(req.session.passport.user) ).cart.toString()
            if ( req.session.user.info.cart !== cart ) req.session.user.info.cart = cart

            const limit = req.query.limit ? Number(req.query.limit) : 2     // Definición de resultados por página
            const page = req.query.page ? Number(req.query.page) : 1        // Definición de página inicial

            // Se comprueba que las constantes estén cargadas con números. De lo contrario se arroja advertencia
            if ( isNaN(limit) || isNaN(page) )
                return httpResponse.WrongInfo(res, errorsConstants.LIMIT_PAGE_NUMBER)
            else {

                // Se consulta de la base de datos todos los resultados en propiedad 'products.docs'. El resto de las propiedades retornan estadísticas y paginado
                const products = await getAllService(limit, page, null, null)

                // let url = `http://${req.hostname}:${config.PORT || 8080}/`
                let url = `${req.protocol}://${req.headers.host}/`
                
                let prevLink = (products.hasPrevPage)? `${url + '?page='+products.prevPage}` : null
                let nextLink = (products.hasNextPage)? `${url + '?page='+products.nextPage}` : null

                let url2 = ''
                
                if ( req.query.limit ) `${url2+='&limit='+limit}`

                prevLink = prevLink ? prevLink += url2 : null
                nextLink = nextLink ? nextLink += url2 : null

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
                        homeLink: url + `?page=1${url2}`,
                        first_name: req.session.user.info.first_name,
                        last_name: req.session.user.info.last_name,
                        cart: req.session.user.info.cart,
                        admin: req.session?.user?.info?.role === 'admin'
                    }

                    detectBrowser(req.get('User-Agent')) ? res.render( 'home', responseObject ) : httpResponse.Ok(res, responseObject)

                } else
                    return httpResponse.NotFound(res, errorsConstants.PRODS_NOT_FOUND)
            }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

export const listAllApisView = async (req, res) => {
    try {
        detectBrowser(req.get('User-Agent')) ? res.status(200).render('apis') : httpResponse.Ok(res, 'Use /docs endpoint to check the list of endpoints available.')
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

export const currentSession = async (req, res) => {
    try {
        if ( req.session?.user )
            return httpResponse.Ok(res, req.session.user.info)
        else
            return httpResponse.Unauthorized(res, 'Not logged in')
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

export const listAllProdsRealtimeView = async (req, res) => {
    try {
        detectBrowser(req.get('User-Agent')) ? res.render('realTimeProducts') : httpResponse.WrongInfo(res, 'This endpoint requires an appropriate web browser to use this view!')
    } catch (error) {
        return httpResponse.ServerError(res, error.message)    }
};

export const chatView = async (req, res) => {
    try {
        const io = req.app.get("io");
        io.emit('user_logged', req.session.user.info.email);
        detectBrowser(req.get('User-Agent')) ? res.render('chat', {layout: 'chat-main', user: req.session.user.info.email}) : httpResponse.WrongInfo(res, 'Use an appropriate web browser to use this endpoint!')
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

export const loggerTest = async (req, res) => {
    try {
        req.logger.debug("Nivel activo winston");
        req.logger.http("Nivel activo winston");
        req.logger.info("Nivel activo winston");
        req.logger.warning("Nivel activo winston");
        req.logger.error("Nivel activo winston");
        req.logger.fatal("Nivel activo winston");
        return httpResponse.Ok(res, "Endpoint de pruebas de niveles de logger winston")
    } catch (error) {
        return httpResponse.ServerError(res, error.message)    }
};

export const pageNotFoundView = async (req, res) => {
    try {
        detectBrowser(req.get('User-Agent')) ? res.status(404).render('404') : httpResponse.NotFound(res, '[404] - Page not found!')
    } catch (error) {
        return httpResponse.ServerError(res, error.message)    }
};