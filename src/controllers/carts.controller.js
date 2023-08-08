import { getAllService, getByIdService, createService, updateService, deleteByIdService, emptyCartService, updateProdCantService, addProdsService } from "../services/carts.services.js";

// Ruta TESTING todos los carritos
export const getAllController = async(req, res) => {
    try {
        const carts = await getAllService()
        
        if(carts.length){
            res.status(200).json({ message: 'Carts found', carts })
            // res.status(200).json(carts)
        } else {
            res.status(400).send('Carts not found')
        }
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Ruta por ID de carrito
export const getByIdController = async(req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //if ( isNaN(cid) )
        if ( !cid )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        else {
            const cart = await getByIdService(cid)
            if (cart)
                res.status(200).json({ message: 'Cart found', cart })
            else
                res.status(400).send('Cart not found')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Alta de nuevo carrito
export const createController = async (req, res) => {
    try {
            const cart = await createService()
            if(cart)
                res.status(200).json({ status: true, id: cart._id.toJSON(), message: "Cart added!" });
            else
                res.status(400).json({ status: false, message: "Invalid cart!" });
    } catch (error) {
        res.status(404).json({ message: error.message });
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
            if ( isNaN(cant) )
                res.status(400).json({ message: 'Product quantity must be a number!' })
        
        //if ( isNaN(cid) )
        if ( !cid )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        //if ( isNaN(pid) )
        if ( !pid )
            res.status(400).json({ message: 'Product ID must be a number!' })

        

        //if ( !isNaN(cid) && !isNaN(pid)){
        if ( cid && pid && cant) {
            const newCart = await updateProdCantService(cid, pid, cant);
            if(newCart === 1)
                res.status(200).json("Product added to cart!");
            else if ( newCart === 0)
                    res.status(404).json({ message: "Cart not found!" })
                else
                    res.status(400).json({ message: "Product stock exceeded! Check product stock!" })
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Agregado de nuevos productos por array en carrito preexistente por body
export const addProdsController = async (req, res) => {
    try {
        const cid = req.params.cid

        const products = req.body

        /*  Ejemplo de BODY a enviar
        [
            {"product": "64c01e474f89b7371af4cd35", "quantity": 1},
            {"product": "64c83088a804867a9d2641ee", "quantity": 2}
        ]
        */

        if ( JSON.stringify(req.body) === JSON.stringify({}) )
            res.status(400).send(`Information missing in body
        
                Example below for request body:
                [
                    \t{"product": "64c01e474f89b7371af4cd35", "quantity": 1},
                    \t{"product": "64c83088a804867a9d2641ee", "quantity": 2}
                ]`
            )
        else {
            const newCart = await addProdsService(cid, products);
            if(newCart === 1)
                res.status(200).json("Product added to cart!");
            else
                res.status(400).json({ message: "Invalid cart or product!" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }        
};

// Alta o sumatoria de nuevo producto en carrito preexistente
export const updateController = async (req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //const pid = Number(req.params.pid);
        const pid = req.params.pid
        //if ( isNaN(cid) )
        if ( !cid )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        //if ( isNaN(pid) )
        if ( !pid )
            res.status(400).json({ message: 'Product ID must be a number!' })

        //if ( !isNaN(cid) && !isNaN(pid)){
        if ( cid && pid){
            const newCart = await updateService(cid, pid, "+");
            if(newCart)
                res.status(200).json("Product added to cart!");
            else
                res.status(400).json({ message: "Invalid cart or product!" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
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
        if ( !req.params.cid || !isNaN(req.params.cid) )
            res.status(400).json({ message: 'Wrong Cart ID or not defined!' })
        //if ( isNaN(pid) )
        if ( !req.params.pid || !isNaN(req.params.pid) )
            res.status(400).json({ message: 'Wrong Product ID or not defined!' })

        //if ( !isNaN(cid) && !isNaN(pid)){
        if ( cid && pid && isNaN(cid) && isNaN(pid) ) {
            const newCart = await updateService(cid, pid, "-");
            if(newCart)
                res.status(200).json("Product removed from cart!");
            else
                res.status(400).json({ message: "Invalid cart or product!" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteByIdController = async(req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //if ( isNaN(cid) )
        if ( !cid )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        else {
            const cartDel = await deleteByIdService(cid);
            if(cartDel)
                res.send(`Cart ID: ${cid} deleted successfully`)
            else
                res.send(`Cart ID: ${cid} not found`)
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
};

export const emptyCartController = async(req, res) => {
    try {
        //const cid = Number(req.params.cid);
        const cid = req.params.cid
        //if ( isNaN(cid) )
        if ( !cid )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        else {
            const emptyCart = await emptyCartService(cid);
            if(emptyCart)
                res.send(`Products removed from Cart ID: ${cid} successfully`)
            else
                res.send(`Cart ID: ${cid} not found`)
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
};