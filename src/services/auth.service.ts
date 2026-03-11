import { inject, injectable } from "inversify"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { IAuthService } from "../interfaces/services/i-auth-service"
import { IUserRepository } from "../interfaces/repositories/i-user-repository"

import { LoginRequestDTO } from "../interfaces/dtos/login-requset-dto"
import { AuthResponseDTO } from "../interfaces/dtos/auth-response-dto"

import { ERROR_MESSAGES } from "../constants/error-messages"

@injectable()
export class AuthService implements IAuthService {
    private _userRepository: IUserRepository

  constructor(
    @inject("IUserRepository") userRepository: IUserRepository
  ) {
    this._userRepository = userRepository
  }

  async register(email: string, password: string): Promise<AuthResponseDTO> {

    const existingUser = await this._userRepository.findByEmail(email)

    if (existingUser) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this._userRepository.create({
      email,
      password: hashedPassword,
      createdAt: new Date()
    })

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    )

    return {
      token,
      userId: user._id.toString(),
      email: user.email
    }

  }

  async login(data: LoginRequestDTO): Promise<AuthResponseDTO> {

    const user = await this._userRepository.findByEmail(data.email)

    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    )

    return {
      token,
      userId: user._id.toString(),
      email: user.email
    }

  }

}


// Property '_id' does not exist on type 'IUser'.


// import { inject, injectable } from "inversify"

// import { ITripService } from "../interfaces/services/i-trip-service"
// import { ITripRepository } from "../interfaces/repositories/i-trip-repository"

// import { UploadTripDTO } from "../interfaces/dtos/upload-trip-dto"
// import { TripListResponseDTO } from "../interfaces/dtos/trip-list-response-dto"
// import { TripDetailsResponseDTO } from "../interfaces/dtos/trip-details-response-dto"

// @injectable()
// export class TripService implements ITripService {
//     private _tripRepository: ITripRepository

//   constructor(
//     @inject("ITripRepository") tripRepository: ITripRepository
//   ) {
//     this._tripRepository = tripRepository
//   }

//   async uploadTrip(data: UploadTripDTO, filePath: string): Promise<void> {

//     // CSV parsing + trip calculation will be implemented later

//   }

//   async getTrips(userId: string): Promise<TripListResponseDTO[]> {

//     const trips = await this._tripRepository.findTripsByUser(userId)

//     return trips.map(trip => ({
//       id: trip._id.toString(),
//       tripName: trip.tripName,
//       totalDistance: trip.totalDistance,
//       tripDuration: trip.tripDuration,
//       startTime: trip.startTime,
//       endTime: trip.endTime
//     }))

//   }

//   async getTripDetails(tripId: string): Promise<TripDetailsResponseDTO> {

//     const trip = await this._tripRepository.findById(tripId)

//     if (!trip) {
//       throw new Error("Trip not found")
//     }

//     return {
//       id: trip._id.toString(),
//       tripName: trip.tripName,
//       totalDistance: trip.totalDistance,
//       tripDuration: trip.tripDuration,
//       totalIdling: trip.totalIdling,
//       totalStoppage: trip.totalStoppage,
//       overspeedCount: trip.overspeedCount,
//       maxSpeed: trip.maxSpeed,
//       gpsPoints: trip.gpsPoints
//     }

//   }

// }

// 'data' is declared but its value is never read.

// 'filePath' is defined but never used.
// Property '_id' does not exist on type 'ITrip'.