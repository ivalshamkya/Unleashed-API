import { logger } from "../application/logging.js";
import { ResponseError } from "../error/response-error.js"

const errorMiddleware = async (err, req, res, next) => {

    if(!err) {
        next();
        return;
    }

    if(err instanceof ResponseError) {
        return res.status(err.status).json({
            message: err.message
        }).end();
    } else {
        return res.status(500).json({
            message: err.message
        }).end();
    }
}

export {
    errorMiddleware
}