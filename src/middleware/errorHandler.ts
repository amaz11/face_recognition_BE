import { Response, Request, NextFunction } from 'express'
import errorResponse from "../utils/ErrorResponse";


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error: any = { ...err };
    error.message = err.message;
    if (error.name === "CastError") {
        const message = "Resource not found";
        error = new errorResponse(message, 400);
    }

    if (error.code === "P1000") {
        const message = "Authentication failed against database server";
        error = new errorResponse(message, 400);
    }
    if (error.code === "P1008") {

        error = new errorResponse(error.message, 400);
    }

    if (error.code === "P2002") {
        error = new errorResponse(error.message, 400);
    }

    if (error.code === "P2025") {
        const message = `Table ${error.meta.modelName} cause ${error.meta.cause}`
        error = new errorResponse(message, 400);
    }

    if (error.name === "PrismaClientValidationError") {
        const message = "Unknown Argument or Argument is missing";
        error = new errorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        code: error,
        error: error.message || "Server Error",
    });
};

export default errorHandler;
