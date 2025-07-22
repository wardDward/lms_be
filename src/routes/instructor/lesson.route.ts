import { Router } from "express";
import { showLesson } from "../../controller/instructor/lesson.controller";


const lessonRouter = Router()


lessonRouter.route('/:uuid').get(showLesson)

export default lessonRouter