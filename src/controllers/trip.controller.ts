import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { BaseController } from "../base/base-controller"

import { ITripController } from "../interfaces/controllers/i-trip-controller"
import { ITripService } from "../interfaces/services/i-trip-service"

import { STATUS_CODES } from "../constants/status-codes"
import { SUCCESS_MESSAGES } from "../constants/success-messages"
import { ERROR_MESSAGES } from "../constants/error-messages"
import { AuthRequest } from "../interfaces/Request/AuthRequest"

@injectable()
export class TripController extends BaseController implements ITripController {

  private _tripService: ITripService

  constructor(
    @inject("ITripService") tripService: ITripService
  ) {
    super()
    this._tripService = tripService
  }

  async uploadTrip(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthRequest
      const userId = authReq.userId as string
      const tripName = req.body.tripName
      const filePath = req.file?.path
      await this._tripService.uploadTrip( { userId, tripName }, filePath as string )
      return this.sendSuccess( res, STATUS_CODES.CREATED, SUCCESS_MESSAGES.TRIP_UPLOADED )
    } catch (error) {
      return this.sendError( res, STATUS_CODES.BAD_REQUEST,
      error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    )
  }
  }

  async getTrips(req: Request, res: Response): Promise<Response> {
      try {

        const authReq = req as AuthRequest
        const userId = authReq.userId as string

        const search = req.query.search as string | undefined
        const filter = req.query.filter as string | undefined

        const page = req.query.page ? Number(req.query.page) : 1
        const limit = req.query.limit ? Number(req.query.limit) : 5

        const result = await this._tripService.getTrips(
          userId,
          search,
          filter,
          page,
          limit
        )

        return this.sendSuccess( res, STATUS_CODES.OK, SUCCESS_MESSAGES.TRIPS_FETCHED, result )

      } catch (error) {

        return this.sendError(
          res,
          STATUS_CODES.BAD_REQUEST,
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        )

      }
    }

  async getTripDetails(req: Request, res: Response): Promise<Response> {
    try {
      const tripId = req.params.tripId as string
      const trip = await this._tripService.getTripDetails(tripId)
      return this.sendSuccess( res, STATUS_CODES.OK, SUCCESS_MESSAGES.TRIP_FETCHED, trip )

    } catch (error) {
      return this.sendError( res, STATUS_CODES.BAD_REQUEST,
        error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      )
    }
  }

  async deleteTrip(req: Request, res: Response): Promise<Response> {
      try {
        const tripId = req.params.tripId as string
        await this._tripService.deleteTrip(tripId)
        return this.sendSuccess( res, STATUS_CODES.OK, "Trip deleted successfully" )
      } catch (error) {
        return this.sendError( res,  STATUS_CODES.BAD_REQUEST,
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        )
      }
  }
}