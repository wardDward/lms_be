import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import errorHandler from './middleware/globalErrorhandler'
import authRouter from './routes/auth.route'

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)

app.use(errorHandler)
app.listen(port, () => {
    console.log(`Connected to port: ${port}`)
})