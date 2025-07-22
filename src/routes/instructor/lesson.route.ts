import { Router } from "express";
import { showLessons } from "../../controller/instructor/lesson.controller";


const lessonRouter = Router()


lessonRouter.route('/').get(showLessons)

export default lessonRouter