import { Router } from "express"
import container from "../config/container"

import { IAuthController } from "../interfaces/controllers/i-auth-controller"
import { AUTH_ROUTES } from "../constants/route-paths"
import { validate } from "../middleware/validate.middleware"
import { loginSchema, registerSchema } from "../validations/auth.validations"
import { loginRateLimiter } from "../middleware/rateLimiter.middleware"

const router = Router()

const authController = container.get<IAuthController>("IAuthController")

router.post(AUTH_ROUTES.REGISTER, (req, res, next) => {
  console.log("Register request received")
  next()
}, validate(registerSchema), authController.register.bind(authController))
router.post(AUTH_ROUTES.LOGIN, loginRateLimiter, validate(loginSchema), authController.login.bind(authController))

export default router