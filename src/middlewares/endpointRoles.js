import config from "../config.js";
import { HttpResponse } from "../utils/http.responses.js";
import errors from "../utils/errors/errors.constants.js";
const httpResponse = new HttpResponse()

const access = ( ...roles ) => {
    return ( req, res, next ) => {
        const role = req.session.user?.info.role.toLowerCase()
        if ( config.DEBUG || Number(config.DEBUG) === 1 || config.TESTING ) {
            req.logger.debug(`Endpoint ${req.url} access granted!`);
            next();
        }
        else {
            if ( roles.includes( role ) ) {
                req.logger.debug(`Endpoint ${req.url} access granted!`);
                next();
            }
            else {
                req.logger.debug(`Endpoint ${req.url} access denied! No suitable role.`);
                return httpResponse.Unauthorized(res, errors.NO_ROLE)
            }
        }
    }
}

export default access