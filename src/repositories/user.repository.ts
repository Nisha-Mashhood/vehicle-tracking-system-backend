import { injectable } from "inversify"
import { BaseRepository } from "../base/base-repository"
import { IUser } from "../interfaces/models/i-user"
import { IUserRepository } from "../interfaces/repositories/i-user-repository"
import { UserModel } from "../models/user.model"
import { HydratedDocument } from "mongoose"

@injectable()
export class UserRepository  extends BaseRepository<IUser>  implements IUserRepository
{

  constructor() {
    super(UserModel)
  }

  async findByEmail(email: string): Promise<HydratedDocument<IUser> | null> {
    return UserModel.findOne({ email }).exec()
  }

}