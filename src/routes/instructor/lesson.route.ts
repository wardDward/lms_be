import { Router } from "express";
import { deleteLesson, showLessons } from "../../controller/instructor/lesson.controller";


const lessonRouter = Router()


lessonRouter.route('/').get(showLessons)
lessonRouter.route('/:uuid').delete(deleteLesson)

export default lessonRouter