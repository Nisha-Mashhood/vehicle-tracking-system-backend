import { IBaseRepository } from "./i-base-repository"
import { ITrip } from "../models/i-trip"
import { HydratedDocument } from "mongoose"

export interface ITripRepository extends IBaseRepository<ITrip> {

  findTripsByUser(userId: string): Promise<HydratedDocument<ITrip>[]>

}