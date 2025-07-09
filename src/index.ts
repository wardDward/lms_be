import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import errorHandler from './middleware/globalErrorhandler'
import authRouter from './routes/auth.route'
import { default as InstructorCourse } from './routes/instructor/course.route'

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:5173']
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/courses', InstructorCourse)

app.use(errorHandler)
app.listen(port, () => {
    console.log(`Connected to port: ${port}`)
})