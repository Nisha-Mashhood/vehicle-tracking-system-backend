import { IBaseRepository } from "./i-base-repository"
import { ITrip } from "../models/i-trip"
import { HydratedDocument } from "mongoose"

export interface ITripRepository extends IBaseRepository<ITrip> {

  findTripsByUser(
    userId: string,
    search: string | undefined,
    filter: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    trips: HydratedDocument<ITrip>[]
    total: number
  }>



}