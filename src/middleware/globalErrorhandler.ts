import { Request, Response, NextFunction } from "express";


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500
    res.status(status).json({
        code: status,
        message: err.message || 'Internal Server Error',
        stacks: process.env.NODE_ENV !== 'production' && err.stacks
    })
}


export default errorHandler