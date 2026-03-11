import { Container } from "inversify"

// repositories
import { IUserRepository } from "../interfaces/repositories/i-user-repository"
import { ITripRepository } from "../interfaces/repositories/i-trip-repository"

import { UserRepository } from "../repositories/user.repository"
import { TripRepository } from "../repositories/trip.repository"

// services
import { IAuthService } from "../interfaces/services/i-auth-service"
import { ITripService } from "../interfaces/services/i-trip-service"

import { AuthService } from "../services/auth.service"
import { TripService } from "../services/trip.service"

// controllers
// import { IAuthController } from "../interfaces/controllers/i-auth-controller"
// import { ITripController } from "../interfaces/controllers/i-trip-controller"

// import { AuthController } from "../controllers/auth.controller"
// import { TripController } from "../controllers/trip.controller"

const container = new Container()

// Repository bindings
container.bind<IUserRepository>("IUserRepository").to(UserRepository)
container.bind<ITripRepository>("ITripRepository").to(TripRepository)

// Service bindings
container.bind<IAuthService>("IAuthService").to(AuthService)
container.bind<ITripService>("ITripService").to(TripService)

// Controller bindings
// container.bind<IAuthController>("IAuthController").to(AuthController)
// container.bind<ITripController>("ITripController").to(TripController)

export default container