import { Router } from "express";
import { createCourse } from "../../controller/instructor/course.controller";


const courseRouter = Router()

courseRouter.route('/').post(createCourse)

export default courseRouter