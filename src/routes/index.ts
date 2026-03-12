import { Router } from "express"

import authRoutes from "./auth.route"
import tripRoutes from "./trip.route"

const router = Router()

router.use("/auth", authRoutes)
router.use("/trips", tripRoutes)

export default router