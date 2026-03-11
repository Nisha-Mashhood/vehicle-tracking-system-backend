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

  async findTripsByUser(userId: string): Promise<HydratedDocument<ITrip>[]> {
    return TripModel.find({ userId }).exec()
  }

}