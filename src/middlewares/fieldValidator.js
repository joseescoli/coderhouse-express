const fieldValidator = (req, res, next) => {

    const title = String(req.body.title)
    const description = String(req.body.description)
    const code = String(req.body.code)
    const price = parseFloat(req.body.price)
    const stock = Number(req.body.stock)
    const category = String(req.body.category)
    const thumbnails = String([req.body.thumbnails]) || []

    if ( !isNaN(title) )
        res.status(400).json({ message: 'Product title must be a string!' })
    if ( !isNaN(description) )
        res.status(400).json({ message: 'Product description must be a string!' })
    if ( !isNaN(code) )
        res.status(400).json({ message: 'Product code must be a string!' })
    if ( isNaN(price) )
        res.status(400).json({ message: 'Product price must be a number!' })
    if ( isNaN(stock) )
        res.status(400).json({ message: 'Product stock must be a number!' })
    if ( !isNaN(category) )
        res.status(400).json({ message: 'Product category must be a string!' })
    
    if (thumbnails.length === 0)
        res.status(200).json({ message: 'Product with no thumbnails paths!' })

    if ( isNaN(title) && isNaN(description) && isNaN(code) && !isNaN(price) && !isNaN(stock) && isNaN(category) )
        next()
}

export default fieldValidator