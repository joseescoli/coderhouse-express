import { getAllService, getByIdService, createService, updateService, deleteByIdService, emptyCartService, updateProdCantService, addProdsService, purchaseCartService } from "../services/carts.services.js";
import { getByIdService as getProdById } from "../services/products.services.js";
import UserDao from "../dao/mongodb/managers/user.dao.js";
const userDao = new UserDao()
import { HttpResponse } from "../utils/http.responses.js";
const httpResponse = new HttpResponse()
import errorsConstants from "../utils/errors/errors.constants.js";
import config from "../config.js";

// Ruta TESTING todos los carritos
export const getAllController = async(req, res) => {
    try {
        const carts = await getAllService()
        
        if(carts.length){
            return httpResponse.Ok(res, { info: errorsConstants.CARTS_FOUND, payload: carts })
        } else {
            return httpResponse.NotFound(res, errorsConstants.CARTS_NOT_FOUND)
        }
        
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

// Ruta por ID de carrito
export const getByIdController = async(req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //if ( isNaN(cid) )
        if ( !cid ) {
            req.logger.debug(`Cart ID must be number. CART ID: ${cid}`)
            return httpResponse.WrongInfo(res, 'Wrong Cart ID!')
        }
        else {
            const cart = await getByIdService(cid)
            if (cart)
                return httpResponse.Ok(res, { info: errorsConstants.CART_FOUND, payload: cart })
            else {
                return httpResponse.WrongInfo(res, `${cid} not found!`)
            }
        }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

// Alta de nuevo carrito
export const createController = async (req, res) => {
    try {
            const cart = await createService()
            if(cart)
                return httpResponse.Ok(res, 'Cart created!')
            else {
                return httpResponse.WrongInfo(res, 'Invalid cart!')
            }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

// Agregado de cantidad de productos definida en carrito preexistente por body
export const updateProdCantController = async (req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //const pid = Number(req.params.pid);
        const pid = req.params.pid
        
        const cant = req.body.cant ? Number(req.body.cant) : 1

        if ( req.body.cant )
            if ( isNaN(cant) ) {
                return httpResponse.WrongInfo(res, 'Product quantity must be a number!')
            }
        
        if ( !cid ) {
            return httpResponse.WrongInfo(res, `Wrong cart ${cid} specified.`)
        }
        if ( !pid ) {
            return httpResponse.WrongInfo(res, `Wrong product ID ${pid} specified.`)
        }

        if ( cid && pid && cant) {
            const owner = (await getProdById(pid)).owner
            if ( req.session.user.info.role === 'premium' && owner === req.session.user.info.email && !(config.DEBUG) )
                return httpResponse.Unauthorized(res, errorsConstants.CART_NO_ADD_PREMIUM)
            else {
                const newCart = await updateProdCantService(cid, pid, cant);
                if(newCart === 1)
                    return httpResponse.Ok(res, 'Product added to cart!')
                else if ( newCart === 0) {
                    return httpResponse.NotFound(res, 'Cart not found!')
                    }
                    else {
                        return httpResponse.WrongInfo(`Quantity ${cant} exceeds for product ID ${pid} stock!`)
                    }
            }
        }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

// Agregado de nuevos productos por array en carrito preexistente por body
export const addProdsController = async (req, res) => {
    try {
        const cid = req.params.cid

        const products = []
        products.push(req.body)

        /*  Ejemplo de BODY a enviar
        [
            {"product": "64c01e474f89b7371af4cd35", "quantity": 1},
            {"product": "64c83088a804867a9d2641ee", "quantity": 2}
        ]
        */

        if ( JSON.stringify(req.body) === JSON.stringify({}) ) {
            return httpResponse.WrongInfo(res, `Information missing in body.    
            Example below for request body:
            [
                \t{"product": "64c01e474f89b7371af4cd35", "quantity": 1},
                \t{"product": "64c83088a804867a9d2641ee", "quantity": 2}
            ]`)
        }
        else {
            const checkOwner = products.some( async prod => ( await getProdById(prod) ).owner === req.session.user.info.email )
            if ( req.session.user.info.role === 'premium' && checkOwner && !(config.DEBUG) )
                return httpResponse.Unauthorized(res, errorsConstants.CART_NO_ADD_PREMIUM)
            else {
                const newCart = await addProdsService(cid, products);
                if(newCart === 1)
                    return httpResponse.Ok(res, 'Product added to cart!')
                else {
                    return httpResponse.WrongInfo(res, 'Invalid cart or product!')
                }
            }
        }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }        
};

// Alta o sumatoria de nuevo producto en carrito preexistente
export const updateController = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        if ( !cid ) {
            return httpResponse.WrongInfo(res, `Wrong cart ${cid} specified.`)
        }
        if ( !pid ) {
            return httpResponse.WrongInfo(res, `Wrong product ID ${pid} specified.`)
        }

        if ( cid && pid){

            const owner = (await getProdById(pid)).owner
            if ( req.session.user.info.role === 'premium' && owner === req.session.user.info.email && !(config.DEBUG) )
                return httpResponse.Unauthorized(res, errorsConstants.CART_NO_ADD_PREMIUM)
            else {
                const newCart = await updateService(cid, pid, "+");
                if(newCart) {
                    req.logger.info(`Product ${pid} added to cart ${cid}!`)
                    return httpResponse.Ok(res, 'Product added to cart!')
                }
                else {
                    return httpResponse.WrongInfo(res, `Invalid cart ${cid} or product ID ${pid} specified.`)
                }
            }
        }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

// Borrado de producto en carrito preexistente
export const deleteProdController = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        if ( !req.params.cid || !isNaN(req.params.cid) ) {
            return httpResponse.WrongInfo(res, 'Wrong Cart ID or not defined!')
        }
        if ( !req.params.pid || !isNaN(req.params.pid) ) {
            return httpResponse.WrongInfo(res, 'Wrong Product ID or not defined!')
        }

        if ( cid && pid && isNaN(cid) && isNaN(pid) ) {
            const newCart = await updateService(cid, pid, "-");
            if(newCart)
            return httpResponse.Ok(res, 'Product removed from cart!')
            else {
                return httpResponse.WrongInfo(res, `Invalid cart ${cid} or product ID ${pid} specified.`)
            }
        }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

export const deleteByIdController = async(req, res) => {
    try {
        const cid = req.params.cid
        if ( !cid ) {
            return httpResponse.WrongInfo(res, 'Card ID must be correct')
        }
        else {
            const cartDel = await deleteByIdService(cid);
            if(cartDel)
                return httpResponse.Ok(res, `Cart ID: ${cid} deleted successfully`)
            else {
                return httpResponse.NotFound(res, `Cart ID: ${cid} not found`)
            }
        }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

export const emptyCartController = async(req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //if ( isNaN(cid) )
        if ( !cid ) {
            return httpResponse.WrongInfo(res, 'Cart ID must be correct!')
        }
        else {
            const emptyCart = await emptyCartService(cid);
            if(emptyCart)
                return httpResponse.Ok(res, `Products removed from Cart ID: ${cid} successfully`)
            else {
                return httpResponse.NotFound(res, `Cart ID: ${cid} not found`)
            }
        }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};

// PUT ==> /api/carts/:cid/purchase
export const purchaseController = async(req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const user = await userDao.getByEmail(req.session.user.info.email)
        const cart = (user.cart).toString()
        const cid = req.params.cid === cart ? req.params.cid : false
        //if ( isNaN(cid) )
        if ( !cid ) {
            return httpResponse.WrongInfo(res, 'Invalid cart ID provided!')
        }
        else {
            const ticket = { purchaser: req.session.user.info.email, code: cid }
            const response = await purchaseCartService(ticket);
            if ( response ) {
                const data = {
                    message: `Products from cart purchased! Ticket CODE ${cid} is a reference for your purchase. Keep track or copy it! Total amount: $${response.amount}. An email will be sent with all these information.`,
                    cart: response.cart
                }
                req.logger.debug(data.message)
                return httpResponse.Purchase(res, data)
            }
            else {
                return httpResponse.WrongInfo(res, `Cart ID: ${cid} not found or empty`)
            }
        }
    } catch (error) {
        return httpResponse.ServerError(res, error.message)
    }
};