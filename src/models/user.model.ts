import { Schema, model } from "mongoose"
import { IUser } from "../interfaces/models/i-user"

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  }
)

export const UserModel = model<IUser>("User", UserSchema)