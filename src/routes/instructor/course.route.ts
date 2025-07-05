import { Router } from "express";
import { createCourse } from "../../controller/instructor/course.controller";
import { validateCourse } from "../../middleware/validation/instructor/course";


const courseRouter = Router()

courseRouter.route('/').post(validateCourse, createCourse)

export default courseRouter