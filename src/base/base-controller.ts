import { Response } from "express"
import { IBaseController } from "../interfaces/controllers/i-base-controller"

export class BaseController implements IBaseController {

  sendSuccess( res: Response, statusCode: number, message: string, data?: unknown ): Response {
    return res.status(statusCode).json({ success: true, message, data })
  }

  sendError( res: Response, statusCode: number, message: string ): Response {
    return res.status(statusCode).json({ success: false, message })
  }

}