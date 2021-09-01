import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { AccessTokenError, BadRequestError } from '../core/logic/apiError'
import asyncHandler from '../helpers/asyncHandler'

export async function verifyToken (req: Request, res: Response, next: NextFunction): Promise<void> {
  asyncHandler(async () => {
    let accessToken
    if (!accessToken) throw new AccessTokenError()
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      accessToken = req.headers.authorization.split(' ')[1]
    } else {
      throw new BadRequestError()
    }

    await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY)

    next()
  }, next)
}
