import { Router } from "express"
import container from "../config/container"

import { IAuthController } from "../interfaces/controllers/i-auth-controller"
import { AUTH_ROUTES } from "../constants/route-paths"

const router = Router()

const authController = container.get<IAuthController>("IAuthController")

router.post(AUTH_ROUTES.REGISTER, (req, res) => authController.register(req, res))
router.post(AUTH_ROUTES.LOGIN, (req, res) => authController.login(req, res))

export default router