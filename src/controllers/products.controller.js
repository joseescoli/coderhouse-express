// Carga de servicios para llamadas de productos e invocar sus métodos
import { getAllProds, getAllService, getByIdService, createService, updateService, deleteByIdService, deleteAllService } from "../services/products.services.js";

export const getAllController = async (req, res) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10
        const page = req.query.page ? Number(req.query.page) : 1
        let sort = req.query.sort ? String(req.query.sort).toLowerCase() : null
        const query = {}
        query.name = req.query.query ? String(req.query.query).toLowerCase() : null
        if ( query.name && req.query.value )
            query.value = req.query.value.toLowerCase() === 'true' ? true : req.query.value.toLowerCase() === 'false' ? false : String(req.query.value).toLowerCase()
        else
            query.value = null

        if(req.query.sort)
            if( !( sort === '1' || sort === '-1' || sort === 'a' || sort === 'd') ) sort = null

        if ( isNaN(limit) || isNaN(page) )
            res.status(400).json({
                status: 'Error',
                error: 'limit/page params must be a number!',
                message: error.message

            })
        else {

            const products = await getAllService(limit, page, sort, query);

            let url = `http://${req.hostname}:${req.app.get("port")}/api/products?`
            //url += req.url
            
            let prevLink = (products.hasPrevPage)? `${url + 'page='+products.prevPage}` : null
            let nextLink = (products.hasNextPage)? `${url + 'page='+products.nextPage}` : null

            let url2 = ''
            
            if ( req.query.limit ) `${url2+='&limit='+limit}`
            if ( req.query.sort ) `${url2+='&sort='+sort}`
            if ( req.query.query ) `${url2+='&query='+query.name}`
            if ( req.query.value ) `${url2+='&value='+query.value}`

            prevLink = prevLink ? prevLink += url2 : null
            nextLink = nextLink ? nextLink += url2 : null
            
            if(products.totalDocs){
                res.status(200).json({
                    status: 'success',
                    payload: products.docs,
                    totalPages: products.totalPages,
                    prevPage: products.prevPage,
                    nextPage: products.nextPage,
                    page: products.page,
                    hasPrevPage: products.hasPrevPage?true:false,
                    hasNextPage: products.hasNextPage?true:false,
                    prevLink: prevLink,
                    nextLink: nextLink,
                    records: products.totalDocs
                })
                // res.status(200).json(product)
            } else {
                res.status(400).json({
                    status: 'Error',
                    error: 'Products not found'
                    //message: error.message
                })
            }
        }
        
    } catch (error) {
        res.status(404).json({
            status: 'Error',
            error: 'Error getting products!',
            message: error.message
        });
    }
};

export const getByIdController = async (req, res) => {
    try {
        //const id = Number(req.params.pid);
        const id = req.params.pid
        //if ( isNaN(id) )
        if ( !id )
            res.status(400).json({ message: 'Product ID must be a number!' })
        else {
            const product = await getByIdService(id);
            if(product){
                res.status(200).json({ message: 'Product found', product })
                // res.status(200).json(product)
            } else {
                res.status(400).send('Product not found')
            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createController = async (req, res) => {
    try {
        const io = req.app.get("io");

        const { title, description, code, price, stock, category } = req.body
        const thumbnails = []

        if ( req.body.thumbnails )
            thumbnails.push(...req.body.thumbnails)
        
        const product = { title, description, code, price, stock, category, thumbnails }

        const newProduct = await createService(product);
        if(newProduct) {
            let products = await getAllProds()
            products = products.map(item => item.toJSON())
            // Envía el evento "products" a todos los clientes conectados con la lista actualizada de productos
            io.emit('products', products);
            res.status(200).json("Product added!");
        }
        else
            res.status(404).json({ message: "Invalid product attributes. Verify all fields are complete and avoid duplicate code!. [Fields required: title, description, price, code, stock, category]" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateController = async (req, res) => {
    try {
        const io = req.app.get("io");

        if ( !req.params.pid || !isNaN(req.params.pid))
            res.status(400).json({ message: 'Product ID error or not defined in URL!' })
        else {
//            if ( isNaN( Number( req.params.pid) ) )
//                res.status(400).json({ message: 'Product ID must be a number!' })
//            else {
                //const pid = Number(req.params.pid)
                const pid = req.params.pid
                const updateFields = {}
                if ( req.body.title) updateFields.title = String(req.body.title)
                if ( req.body.description) updateFields.description = String(req.body.description)
                if ( req.body.code) updateFields.code = String(req.body.code)
                if ( req.body.price) updateFields.price = parseFloat(req.body.price)
                if ( req.body.stock ) updateFields.stock = Number(req.body.stock)
                if ( req.body.category ) updateFields.category = String(req.body.category)
                if ( req.body.thumbnails )
                    if ( typeof req.body.thumbnails === 'string')
                        updateFields.thumbnails.push(req.body.thumbnails)
                        else if ( req.body.thumbnails.constructor.name === 'Array')
                            updateFields.thumbnails = req.body.thumbnails

                const update = await updateService(pid, updateFields);
                if(update) {
                    const fields = Object.keys(updateFields).length
                    let products = await getAllProds()
                    products = products.map(item => item.toJSON())
                    // Envía el evento "products" a todos los clientes conectados con la lista actualizada de productos
                    io.emit('products', products);
                    res.send(`Product updated successfully! ${fields} ${fields === 1 ? ' attribute changed.' : ' attributes changed.'}`)
                }
                else
                    res.status(404).send('Product not found or duplicate product code')
//            }
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
};

export const deleteByIdController = async (req, res) =>{
    try {
        const io = req.app.get("io");
        //const pid = Number(req.params.pid);
        const pid = req.params.pid
        //if ( isNaN(pid) )
        if ( !pid )
            res.status(400).json({ message: 'Product ID must be a number!' })
        else {
            const prodDel = await deleteByIdService(pid);
            if(prodDel) {
                let products = await getAllService()
                products = products.map(item => item.toJSON())
                // Envía el evento "products" a todos los clientes conectados con la lista actualizada de productos
                io.emit('products', products);
                res.send(`Product ID: ${pid} deleted successfully`)
            }
            else
                res.send(`Product ID: ${pid} not found`)
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
};

export const deleteAllController = async (req, res) =>{
    try {
        const io = req.app.get("io");
        await deleteAllService();
        let products = await getAllService()
        products = products.map(item => item.toJSON())
        // Envía el evento "products" a todos los clientes conectados con la lista actualizada de productos
        io.emit('products', products);
        res.send('Products deleted successfully')
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
};