import { HttpResponse } from "../utils/http.responses.js"
const http = new HttpResponse();

export const errorHandler = (error, req, res, next) => {
    req.logger.error(error.stack);
    // console.log( `error ${error.message}`) 
    // const status = error.status || 400
    const status = error.statusCode || 500
    // res.status(status).send(error.message)
    return http.ServerError(res, 'Internal Server Error')
}