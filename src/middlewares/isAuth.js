import config from "../config.js";
import { detectBrowser } from "../utils/utils.js";

export const isAuth = ( req, res, next ) => {
    // console.log("\nreq.session.passport.user: " + req.session?.passport?.user);
    // console.log("\nreq.isAuthenticated(): " + req.isAuthenticated());
    // console.log("\nreq.user: " + req.user);
    if( req.isAuthenticated() || config.TESTING )
    return next();
    detectBrowser(req.get('User-Agent')) ? res.status(401).redirect('/login') : res.status(400).send( 'User not logged in!' )
    // res.status(401).send({ msg: 'Unauthorized' })
    // res.render('error')
}