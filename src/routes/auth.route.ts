import { Router } from "express"
import container from "../config/container"

import { IAuthController } from "../interfaces/controllers/i-auth-controller"

const router = Router()

const authController = container.get<IAuthController>("IAuthController")

router.post("/register", (req, res) => authController.register(req, res))
router.post("/login", (req, res) => authController.login(req, res))

export default router