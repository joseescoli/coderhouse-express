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
                res.status(200).json({ status: true, id: cart._id.toJSON(), message: "Cart added!" });
            else {
                res.status(400).json({ status: false, message: "Invalid cart!" });
                req.logger.warning('Wrong cart information provided!')
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
                res.status(400).json({ message: 'Product quantity must be a number!' })
                req.logger.warning(`Product quantity ${cant} wrong format.`)
            }
        
        if ( !cid ) {
            res.status(400).json({ message: 'Cart ID must be a number!' })
            req.logger.warning(`Wrong cart ${cid} specified.`)
        }
        if ( !pid ) {
            res.status(400).json({ message: 'Product ID must be a number!' })
            req.logger.warning(`Wrong product ID ${pid} specified.`)
        }

        if ( cid && pid && cant) {
            const owner = (await getProdById(pid)).owner
            if ( req.session.user.info.role === 'premium' && owner === req.session.user.info.email && !(config.DEBUG) )
                return httpResponse.Unauthorized(res, errorsConstants.CART_NO_ADD_PREMIUM)
            else {
                const newCart = await updateProdCantService(cid, pid, cant);
                if(newCart === 1)
                    res.status(200).json("Product added to cart!");
                else if ( newCart === 0) {
                        res.status(404).json({ message: "Cart not found!" })
                        req.logger.warning(`Cart ID ${cid} not found!`)
                    }
                    else {
                        res.status(400).json({ message: "Product stock exceeded! Check product stock!" })
                        req.logger.warning(`Quantity ${cant} exceeds for product ID ${pid} stock!`)
                    }
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
        req.logger.error(error.message)
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
            res.status(400).send(`Information missing in body
        
                Example below for request body:
                [
                    \t{"product": "64c01e474f89b7371af4cd35", "quantity": 1},
                    \t{"product": "64c83088a804867a9d2641ee", "quantity": 2}
                ]`
            )
            req.logger.warning('Request body infomation missing!')
        }
        else {
            const checkOwner = products.some( async prod => ( await getProdById(prod) ).owner === req.session.user.info.email )
            if ( req.session.user.info.role === 'premium' && checkOwner && !(config.DEBUG) )
                return httpResponse.Unauthorized(res, errorsConstants.CART_NO_ADD_PREMIUM)
            else {
                const newCart = await addProdsService(cid, products);
                if(newCart === 1)
                    res.status(200).json("Product added to cart!");
                else {
                    res.status(400).json({ message: "Invalid cart or product!" });
                    req.logger.warning('Cart or product invalid in requesat body!')
                }
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
        req.logger.error(error.message)
    }        
};

// Alta o sumatoria de nuevo producto en carrito preexistente
export const updateController = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        if ( !cid ) {
            res.status(400).json({ message: 'Cart ID must be a number!' })
            req.logger.warning(`Wrong cart ${cid} specified.`)
        }
        if ( !pid ) {
            res.status(400).json({ message: 'Product ID must be a number!' })
            req.logger.warning(`Wrong product ID ${pid} specified.`)
        }

        if ( cid && pid){

            const owner = (await getProdById(pid)).owner
            if ( req.session.user.info.role === 'premium' && owner === req.session.user.info.email && !(config.DEBUG) )
                return httpResponse.Unauthorized(res, errorsConstants.CART_NO_ADD_PREMIUM)
            else {
                const newCart = await updateService(cid, pid, "+");
                if(newCart)
                    res.status(200).json("Product added to cart!");
                else {
                    res.status(400).json({ message: "Invalid cart or product!" });
                    req.logger.warning(`Invalid cart ${cid} or product ID ${pid} specified.`)
                }
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
        req.logger.error(error.message)
    }
};

// Borrado de producto en carrito preexistente
export const deleteProdController = async (req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //const pid = Number(req.params.pid);
        const pid = req.params.pid
        //if ( isNaN(cid) )
        if ( !req.params.cid || !isNaN(req.params.cid) ) {
            res.status(400).json({ message: 'Wrong Cart ID or not defined!' })
            req.logger.warning(`Wrong cart "${cid}" specified.`)
        }
        //if ( isNaN(pid) )
        if ( !req.params.pid || !isNaN(req.params.pid) ) {
            res.status(400).json({ message: 'Wrong Product ID or not defined!' })
            req.logger.warning(`Wrong product ID "${pid}" specified.`)
        }

        //if ( !isNaN(cid) && !isNaN(pid)){
        if ( cid && pid && isNaN(cid) && isNaN(pid) ) {
            const newCart = await updateService(cid, pid, "-");
            if(newCart)
                res.status(200).json("Product removed from cart!");
            else {
                res.status(400).json({ message: "Invalid cart or product!" });
                req.logger.warning(`Invalid cart ${cid} or product ID ${pid} specified.`)
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
        req.logger.error(error.message)
    }
};

export const deleteByIdController = async(req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //if ( isNaN(cid) )
        if ( !cid ) {
            res.status(400).json({ message: 'Cart ID must not be a number!' })
            req.logger.warning(`Wrong cart ID ${cid} defined!`)
        }
        else {
            const cartDel = await deleteByIdService(cid);
            if(cartDel)
                res.send(`Cart ID: ${cid} deleted successfully`)
            else {
                res.send(`Cart ID: ${cid} not found`)
                req.logger.warning(`Cart ID ${cid} not found!`)
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
        req.logger.error(error.message)
    }
};

export const emptyCartController = async(req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //if ( isNaN(cid) )
        if ( !cid ) {
            res.status(400).json({ message: 'Cart ID must not be a number!' })
            req.logger.warning(`Cart ID ${cid} must not be number!`)
        }
        else {
            const emptyCart = await emptyCartService(cid);
            if(emptyCart)
                res.send(`Products removed from Cart ID: ${cid} successfully`)
            else {
                res.send(`Cart ID: ${cid} not found`)
                req.logger.warning(`Cart ID ${cid} not found!`)
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
        req.logger.error(error.message)
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
            res.status(400).json({ message: 'Cart ID must be valid!' })
            req.logger.warning(`Invalid cart ID provided!`)
        }
        else {
            const ticket = { purchaser: req.session.user.info.email, code: cid }
            const response = await purchaseCartService(ticket);
            if ( response ) {
                res.status(200).json( { message: `Products from cart purchased! Ticket CODE ${cid} is a reference for your purchase. Keep track or copy it! Total amount: $${response.amount}. An email will be sent with all these information.`, cart: response.cart} )
                req.logger.debug(`Products from cart purchased! Ticket CODE ${cid} is a reference for your purchase. Keep track or copy it! Total amount: $${response.amount}. An email will be sent with all these information.`)
            }
            else {
                res.status(400).json(`Cart ID: ${cid} not found or empty`)
                req.logger.warning(`Cart ID: ${cid} not found or empty`)
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
        req.logger.error(error.message)
    }
};