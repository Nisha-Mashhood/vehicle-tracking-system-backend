import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"

interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = ( req: AuthRequest, res: Response, next: NextFunction ) => {

    //get token from header
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }

  const token = authHeader.split(" ")[1]
  try {
    //verify token
    const decoded = verifyToken(token)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    })

  }

}