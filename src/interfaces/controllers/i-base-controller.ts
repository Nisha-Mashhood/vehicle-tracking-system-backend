import { Response } from "express"

export interface IBaseController {
  sendSuccess( res: Response, statusCode: number, message: string, data?: unknown ): Response
  sendError( res: Response, statusCode: number, message: string ): Response
}