import config from "../config.js";
import { detectBrowser } from "../utils/utils.js";

import { HttpResponse } from "../utils/http.responses.js";
const httpResponse = new HttpResponse()
import errorsConstants from "../utils/errors/errors.constants.js";

export const isAuth = ( req, res, next ) => {
    // console.log("\nreq.session.passport.user: " + req.session?.passport?.user);
    // console.log("\nreq.isAuthenticated(): " + req.isAuthenticated());
    // console.log("\nreq.user: " + req.user);
    if( req.isAuthenticated() || config.TESTING )
        return next();
    detectBrowser(req.get('User-Agent')) ? res.redirect('/login') : httpResponse.Unauthorized(res, errorsConstants.USER_NOT_LOGGED)
    // res.status(401).send({ msg: 'Unauthorized' })
    // res.render('error')
}