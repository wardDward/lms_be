import { Router } from "express"
import { login, refreshToken, register } from "../controller/auth/auth.controller"
import { loginValidation, registrationValidation } from "../middleware/validation/auth/auth"


const authRouter = Router()

authRouter.post('/register',registrationValidation, register)
authRouter.post('/login', loginValidation, login)
authRouter.post('/refresh_token', refreshToken)

export default authRouter