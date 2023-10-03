// Incorporado logger para registro de sucesos en conjunto con respuestas
import { logger } from "./logger.js";
import errorsConstants from "./errors/errors.constants.js";

const HttpStatus = {
    OK: 200,
    WRONG_INFO: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export class HttpResponse {

    Ok(res, data){
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'success',
            data: data
        });
    };

    WrongInfo(res, data){
        logger.warning(errorsConstants.PROD_ID_WRONG)
        return res.status(HttpStatus.WRONG_INFO).json({
            status: HttpStatus.WRONG_INFO,
            message: 'Wrong information provided',
            error: data
        });
    }

    NotFound(res, data){
        logger.warning(errorsConstants.PROD_NOT_FOUND)
        return res.status(HttpStatus.NOT_FOUND).json({
            status: HttpStatus.NOT_FOUND,
            message: 'Not Found',
            error: data
        });
    }

    Unauthorized(res, data){
        logger.warning(errorsConstants.UNAUTHORIZED)
        return res.status(HttpStatus.UNAUTHORIZED).json({
            status: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized',
            error: data
        });
    };

    Forbidden(res, data){
        logger.warning(errorsConstants.FORBIDDEN)
        return res.status(HttpStatus.FORBIDDEN).json({
            status: HttpStatus.FORBIDDEN,
            message: 'Forbidden',
            error: data
        });
    };

    ServerError(res, data){
        logger.error(errorsConstants.SERVER_ERROR)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
            error: data
        });
    };

};