import { Router } from "express"
import container from "../config/container"

import { ITripController } from "../interfaces/controllers/i-trip-controller"
import { TRIP_ROUTES } from "../constants/route-paths"
import { authMiddleware } from "../middleware/auth.middleware"
import { upload } from "../middleware/upload.middleware"

const router = Router()

const tripController = container.get<ITripController>("ITripController")

router.post(TRIP_ROUTES.UPLOAD, authMiddleware, upload.single("file"), tripController.uploadTrip.bind(tripController))
router.get(TRIP_ROUTES.GET_ALL, authMiddleware, tripController.getTrips.bind(tripController))
router.get(TRIP_ROUTES.GET_ONE, authMiddleware, tripController.getTripDetails.bind(tripController))

export default router