import { IBaseRepository } from "./i-base-repository"
import { IUser } from "../models/i-user"
import { HydratedDocument } from "mongoose"

export interface IUserRepository extends IBaseRepository<IUser> {

  findByEmail(email: string): Promise<HydratedDocument<IUser> | null>

}