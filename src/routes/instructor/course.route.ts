import { Router } from "express";
import { createCourse, getCourses } from "../../controller/instructor/course.controller";
import { validateCourse } from "../../middleware/validation/instructor/course";


const courseRouter = Router()

courseRouter.route('/')
.get(getCourses)
.post(validateCourse, createCourse)

export default courseRouter