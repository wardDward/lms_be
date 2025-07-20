import { Router } from "express";
// import { createCourse, deleteCourse, getCourses, updateCourse } from "../../controller/instructor/course.controller";
import { validateCourse } from "../../middleware/validation/instructor/course";
import { role_guard } from "../../middleware/roleGuard";
import { authMiddleware } from "../../middleware/authMiddleware";


const courseRouter = Router()

// courseRouter.use([authMiddleware, role_guard('instructor')])
// courseRouter.route('/')
//     .get(getCourses)
//     .post(validateCourse, createCourse)

// courseRouter.route('/:id').delete(deleteCourse).put(updateCourse)

export default courseRouter