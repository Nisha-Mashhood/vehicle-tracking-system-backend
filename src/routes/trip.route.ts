import { Router } from "express"
import container from "../config/container"

import { ITripController } from "../interfaces/controllers/i-trip-controller"
import { TRIP_ROUTES } from "../constants/route-paths"

const router = Router()

const tripController = container.get<ITripController>("ITripController")

router.post(TRIP_ROUTES.UPLOAD, (req, res) => tripController.uploadTrip(req, res))

router.get(TRIP_ROUTES.GET_ALL, (req, res) => tripController.getTrips(req, res) )

router.get(TRIP_ROUTES.GET_ONE, (req, res) => tripController.getTripDetails(req, res))

export default router