import { Router } from "express";
import authRouter from "./auth.route";
import InstructorCourseRouter from "./instructor/course.route";
import InstructorLessonRouter from './instructor/lesson.route'

const apiRouter = Router();

apiRouter.use('/auth', authRouter)
apiRouter.use('/courses', InstructorCourseRouter)
apiRouter.use('/courses/lessons', InstructorLessonRouter)
export default apiRouter;