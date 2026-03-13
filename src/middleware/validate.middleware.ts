import { Request, Response, NextFunction } from "express"
import { AnyObjectSchema, ValidationError } from "yup"

export const validate = (schema: AnyObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false })
      next()
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: error.errors[0]
        })
      }
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      })
    }

  }
}