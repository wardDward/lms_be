import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { register } from './controller/auth/auth.controller'
import errorHandler from './middleware/globalErrorhandler'

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api/auth', register)

app.use(errorHandler    )
app.listen(port, () => {
    console.log(`Connected to port: ${port}`)
})