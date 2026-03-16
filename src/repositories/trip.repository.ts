import { injectable } from "inversify"
import { BaseRepository } from "../base/base-repository"
import { ITrip } from "../interfaces/models/i-trip"
import { ITripRepository } from "../interfaces/repositories/i-trip-repository"
import { TripModel } from "../models/trip.model"
import { HydratedDocument } from "mongoose"

@injectable()
export class TripRepository  extends BaseRepository<ITrip>  implements ITripRepository
{

  constructor() {
    super(TripModel)
  }

  async findTripsByUser(
      userId: string,
      search: string | undefined,
      filter: string | undefined,
      page: number,
      limit: number
    ): Promise<{
      trips: HydratedDocument<ITrip>[]
      total: number
    }> {

      const query: Record<string, unknown> = { userId }

      // ---------- search ----------
      if (search) {
        query.tripName = { $regex: search, $options: "i" }
      }

      // ---------- filters ----------
      if (filter === "idling") {
        query.totalIdling = { $gt: 0 }
      }

      if (filter === "overspeed") {
        query.overspeedCount = { $gt: 0 }
      }

      if (filter === "stoppage") {
        query.totalStoppage = { $gt: 0 }
      }

      const skip = (page - 1) * limit

      const trips = await TripModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec()

      const total = await TripModel.countDocuments(query)

      return {
        trips,
        total
      }
    }

}