import { NextFunction, Request, Response } from "express"

export const role_guard = (...roles:string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!roles.includes(req.user.role.name)){
            res.status(403).json({
                error: "Unauthorized user"
            })
        }
        next()
    }
}   