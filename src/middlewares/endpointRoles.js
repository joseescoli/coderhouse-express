import config from "../config.js";

const access = ( ...roles ) => {
    return ( req, res, next ) => {
        const role = req.session.user?.info.role.toLowerCase()
        if ( config.DEBUG || Number(config.DEBUG) === 1 ) {
            console.log(`Endpoint ${req.url} access granted!`);
            next();
        }
        else {
            if ( roles.includes( role ) ) {
                console.log(`Endpoint ${req.url} access granted!`);
                next();
            }
            else {
                console.log(`Endpoint ${req.url} access denied! No suitable role.`);
                res.status(401).send({ msg: '[401] - Unauthorized access!' })
            }
        }
    }
}

export default access