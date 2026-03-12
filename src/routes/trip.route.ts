import { Router } from "express"
import container from "../config/container"

import { ITripController } from "../interfaces/controllers/i-trip-controller"

const router = Router()

const tripController = container.get<ITripController>("ITripController")

router.post("/upload", (req, res) => tripController.uploadTrip(req, res))

router.get("/:userId", (req, res) =>
  tripController.getTrips(req, res)
)

router.get("/details/:tripId", (req, res) =>
  tripController.getTripDetails(req, res)
)

export default router