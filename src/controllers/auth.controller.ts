import { Request, Response } from "express"
import { inject, injectable } from "inversify"
import { BaseController } from "../base/base-controller"
import { IAuthController } from "../interfaces/controllers/i-auth-controller"
import { IAuthService } from "../interfaces/services/i-auth-service"
import { STATUS_CODES } from "../constants/status-codes"
import { SUCCESS_MESSAGES } from "../constants/success-messages"
import { ERROR_MESSAGES } from "../constants/error-messages"

@injectable()
export class AuthController extends BaseController implements IAuthController {

  private _authService: IAuthService

  constructor(
    @inject("IAuthService") authService: IAuthService
  ) {
    super()
    this._authService = authService
  }

  //Register a new User
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { firstName, lastName, email, password } = req.body
      await this._authService.register( firstName, lastName, email, password )
      return this.sendSuccess( res, STATUS_CODES.CREATED, SUCCESS_MESSAGES.USER_REGISTERED )
   } catch (error) {
      return this.sendError( res, STATUS_CODES.BAD_REQUEST,
        error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      )
    }
  }

  //Login existing user
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this._authService.login(req.body)
      return this.sendSuccess( res, STATUS_CODES.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, result )
    } catch (error) {
      return this.sendError( res, STATUS_CODES.BAD_REQUEST,
        error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      )
    }
  }
}