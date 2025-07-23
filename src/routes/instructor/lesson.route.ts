import { Router } from "express";
import { deleteLesson, showLessons, updateLesson } from "../../controller/instructor/lesson.controller";


const lessonRouter = Router()


lessonRouter.route('/').get(showLessons)
lessonRouter.route('/:uuid').delete(deleteLesson).put(updateLesson)

export default lessonRouter