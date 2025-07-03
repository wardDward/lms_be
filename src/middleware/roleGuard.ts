import { NextFunction, Request, Response } from "express"


export const roles = (...roles:any) => {
    return (req: Request,res: Response,next: NextFunction) => {
        if(!roles.includes(req.user.role)){
            return res.json(403).json({message: "Unauthorized"})
        }
        next()
    }
}