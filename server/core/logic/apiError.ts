import { Response } from 'express'
import { NotFoundResponse, BadRequestResponse, InternalErrorResponse, AuthFailureResponse, ForbiddenResponse, RefreshTokenResponse, AccessTokenResponse } from './apiResponse'
import { ErrorType } from '../../enums/errorType'
import { Strings } from '../../helpers/string'

export class ApiError extends Error {
  constructor (public type: ErrorType, public message: string) {
    super(type)
  }

  public static handle (err: ApiError, res: Response): Response {
    switch (err.type) {
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.BAD_TOKEN:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message).send(res)
      case ErrorType.NOT_FOUND:
        return new NotFoundResponse(err.message).send(res)
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res)
      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message).send(res)
      case ErrorType.REFRESH_TOKEN:
        return new RefreshTokenResponse(err.message).send(res)
      case ErrorType.ACCESS_TOKEN:
        return new AccessTokenResponse(err.message).send(res)
      default:
        return new InternalErrorResponse().send(res)
    }
  }
}
export class AuthFailureError extends ApiError {
  constructor (message = Strings.BAD_CREDENTIALS) {
    super(ErrorType.UNAUTHORIZED, message)
  }
}
export class RefreshTokenError extends ApiError {
  constructor (message = Strings.GENERIC_REFRESH_TOKEN_ERROR) {
    super(ErrorType.REFRESH_TOKEN, message)
  }
}

export class AccessTokenError extends ApiError {
  constructor (message = Strings.GENERIC_ACCESS_TOKEN_ERROR) {
    super(ErrorType.REFRESH_TOKEN, message)
  }
}
export class BadRequestError extends ApiError {
  constructor (message = Strings.GENERIC_BAD_REQUEST_ERROR) {
    super(ErrorType.BAD_REQUEST, message)
  }
}
export class NotFoundError extends ApiError {
  constructor (message = Strings.GENERIC_NOT_FOUND_ERROR) {
    super(ErrorType.NOT_FOUND, message)
  }
}
export class ForbiddenError extends ApiError {
  constructor (message = Strings.GENERIC_FORBIDDEN_ERROR) {
    super(ErrorType.FORBIDDEN, message)
  }
}
export class InternalError extends ApiError {
  constructor (message = Strings.GENERIC_ERROR) {
    super(ErrorType.INTERNAL, message)
  }
}
