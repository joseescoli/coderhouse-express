import { logger } from "../utils/logger.js";

export const loggerHTTP = ( req, res, next ) => {
    req.logger = logger;
    req.logger.http( `${req.session?.user?.info?.email || 'anonymous'} | ${req.method}: ${req.url}` )
    next();
}