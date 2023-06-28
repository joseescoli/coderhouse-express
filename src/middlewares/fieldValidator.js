const fieldValidator = (req, res, next) => {

    const title = String(req.body.title)
    const description = String(req.body.description)
    const code = String(req.body.code)
    const price = parseFloat(req.body.price)
    const stock = Number(req.body.stock)
    const category = String(req.body.category)
    const thumbnails = []
    
    if ( req.body.title) {
        if ( !isNaN(title) )
            res.status(400).json({ message: 'Product title must be a string!' })
    } else
        res.status(400).json({ message: 'Product title not defined. Include it in the request body!' })
        
    if ( req.body.description) {
        if ( !isNaN(description) )
            res.status(400).json({ message: 'Product description must be a string!' })
    } else
        res.status(400).json({ message: 'Product description not defined. Include it in the request body!' })
        
    if ( req.body.code) {
        if ( !isNaN(code) )
            res.status(400).json({ message: 'Product code must be a string!' })
    } else
        res.status(400).json({ message: 'Product code not defined. Include it in the request body!' })
    
    if ( req.body.price) {
        if ( isNaN(price) )
            res.status(400).json({ message: 'Product price must be a number!' })
    } else
        res.status(400).json({ message: 'Product price not defined. Include it in the request body!' })
    
    if ( req.body.stock ) {
        if ( isNaN(stock) )
            res.status(400).json({ message: 'Product stock must be a number!' })
    } else
        res.status(400).json({ message: 'Product stock not defined. Include it in the request body!' })
    
    if ( req.body.category ) {
        if ( !isNaN(category) )
            res.status(400).json({ message: 'Product category must be a string!' })
    }

    if ( req.body.thumbnails ) {
        thumbnails.push(...req.body.thumbnails)
        if ( thumbnails.some( element => typeof element !== 'string') )
            res.status(400).json({ message: 'Product thumbnails must be string or characters!' })
        else if (thumbnails.length === 0)
            res.status(200).json({ message: 'Product with no thumbnails paths!' })
    }

    if ( isNaN(title) && isNaN(description) && isNaN(code) && !isNaN(price) && !isNaN(stock) && isNaN(category) )
        next()
}

export default fieldValidator