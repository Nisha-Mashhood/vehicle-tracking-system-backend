import { Request, Response } from "express"

export interface ITripController {

  uploadTrip(req: Request, res: Response): Promise<Response>

  getTrips(req: Request, res: Response): Promise<Response>

  getTripDetails(req: Request, res: Response): Promise<Response>

}