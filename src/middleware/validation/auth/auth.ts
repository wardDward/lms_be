import { Request, Response, NextFunction } from "express";
import { z } from 'zod'


const registrationSchema = z.object({
    firstname: z.string().min(1, 'Firstname is required').max(100, 'Firstname is maximun of 100 characters only').regex(/^[a-zA-Z0-9]+$/, 'Symbols are not allowed'),
    lastname: z.string().min(1, 'Lastname is required').max(100, 'Lastname is maximun of 100 characters only').regex(/^[a-zA-Z0-9]+$/, 'Symbols are not allowed'),
    middlename: z.string().max(100, 'Middlename is maximum 100 charcters only').optional(),
    email: z.string().email().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is re required').max(100, 'Password is    maximun of 100 characters only'),
    contact: z.string().min(1, 'Contact number is required'),
    age: z.number().min(1, 'Age is required'),
    birth_day: z.coerce.date(),
    gender: z.string().min(1, 'Gender is required')
})


export const registrationValidation = (req: Request, res: Response, next: NextFunction) => {
    const result = registrationSchema.safeParse(req.body)

    if (!result.success) {
        res.status(422).json({
            errors: result.error.flatten().fieldErrors
        })
    }
    req.body = result.data
    next()

}