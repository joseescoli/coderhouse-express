import { logger } from "../utils/logger.js";

export const loggerHTTP = ( req, res, next ) => {
    req.logger = logger;
    req.logger.http( `${req.method}: ${req.url}` )
    next();
}