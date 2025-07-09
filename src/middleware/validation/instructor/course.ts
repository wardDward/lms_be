import { Response, Request, NextFunction } from "express";
import { z } from 'zod'


const createCourseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().transform((val) => val === "" ? null : val).nullable(),
    thumbnail: z.string().transform((val) => val === "" ? null : val).nullable(),
    price: z.preprocess(
        (val) => typeof val === "string" ? parseFloat(val) : val,
        z.number().min(0, 'Price must be a positive number').default(0)
    ),
    is_published: z.boolean().default(false),
    lessons: z.array(z.object({
        chapter: z.preprocess(
            (val) => val === "" ? null : val,
            z.number().nullable()
        ),
        title: z.string().min(1, 'Title is required'),
        content: z.string().transform((val) => val === "" ? null : val).nullable(),
        attachments: z.array(z.object({
            order: z.preprocess(
                (val) => {
                    if (val === "" || val === null || val === undefined) return undefined;
                    return typeof val === "string" ? parseInt(val) : val;
                },
                z.number({ required_error: "Order is required" }).min(1, 'Order must be at least 1')
            ),
            media: z.string().min(1, 'Media is required')
        }))
    }))
})

export const validateCourse = (req: Request, res: Response, next: NextFunction) => {
    const result = createCourseSchema.safeParse(req.body)

    if (!result.success) {
        res.status(422).json({
            errors: result.error.flatten().fieldErrors
        })
        return
    }

    req.body = result.data
    next()
}