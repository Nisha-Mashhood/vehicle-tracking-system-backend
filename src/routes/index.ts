import { Router } from "express"

import authRoutes from "./auth.route"
import tripRoutes from "./trip.route"
import { COMMON_ROUTES } from "../constants/route-paths"

const router = Router()

router.use(COMMON_ROUTES.AUTH, authRoutes)
router.use(COMMON_ROUTES.TRIPS, tripRoutes)

export default router