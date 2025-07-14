import { Router } from "express";
import authRouter from "./auth.route";
import InstructorCourseRouter from "./instructor/course.route";


const apiRouter = Router();

apiRouter.use('/auth', authRouter)
apiRouter.use('/courses', InstructorCourseRouter)
export default apiRouter;