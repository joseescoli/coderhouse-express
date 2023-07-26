import { getAllService, getByIdService, createService, updateService, deleteByIdService } from "../services/carts.services.js";

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
                res.status(200).json("Cart added!");
            else
                res.status(400).json({ message: "Invalid cart!" });
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
        if ( !cid )
            res.status(400).json({ message: 'Cart ID must be a number!' })
        //if ( isNaN(pid) )
        if ( !pid )
            res.status(400).json({ message: 'Product ID must be a number!' })

        //if ( !isNaN(cid) && !isNaN(pid)){
        if ( cid && pid){
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