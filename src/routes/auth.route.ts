import { Router } from "express"
import { login, refreshToken, register } from "../controller/auth/auth.controller"


const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/refresh_token', refreshToken)

export default authRouter