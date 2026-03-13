import { inject, injectable } from "inversify"
import bcrypt from "bcrypt"

import { IAuthService } from "../interfaces/services/i-auth-service"
import { IUserRepository } from "../interfaces/repositories/i-user-repository"

import { LoginRequestDTO } from "../interfaces/dtos/login-requset-dto"
import { AuthResponseDTO } from "../interfaces/dtos/auth-response-dto"

import { ERROR_MESSAGES } from "../constants/error-messages"
import { generateToken } from "../utils/jwt"

@injectable()
export class AuthService implements IAuthService {
    private _userRepository: IUserRepository

  constructor(
    @inject("IUserRepository") userRepository: IUserRepository
  ) {
    this._userRepository = userRepository
  }

  //Register a new user
  async register( firstName: string, lastName: string, email: string, password: string ): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(email)
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await this._userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date()
    })

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
    //generate jwt token
    const token = generateToken({ userId: user._id.toString() })

    return {
      token,
      userId: user._id.toString(),
      email: user.email
    }
  }

}