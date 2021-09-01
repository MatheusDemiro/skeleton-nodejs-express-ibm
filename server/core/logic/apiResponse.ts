import { Response } from 'express'
import { StatusCode } from '../../enums/statusCode'
import { Strings } from '../../helpers/string'

class ApiResponse {
  // eslint-disable-next-line no-useless-constructor
  constructor (
        protected statusCode: StatusCode,
        protected message: string
  ) {
  }

  protected prepare<T extends ApiResponse> (res: Response, response?: T): Response {
    if (response) {
      return res.status(this.statusCode).json(this.formatData(response))
    } else {
      return res.status(this.statusCode).json({ message: this.message, statusCode: this.statusCode })
    }
  }

  public send (res: Response): Response {
    return this.prepare<ApiResponse>(res)
  }

  private formatData<T extends ApiResponse> (response: T) {
    const clone: T = {} as T
    Object.assign(clone, response)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete clone.data
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    for (const i in response.data) clone[i] = response.data[i]
    return clone
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor (message = Strings.GENERIC_AUTH_FAILURE) {
    super(StatusCode.UNAUTHORIZED, message)
  }
}

export class RefreshTokenResponse extends ApiResponse {
  constructor (message = Strings.GENERIC_REFRESH_TOKEN_ERROR) {
    super(StatusCode.UNAUTHORIZED, message)
  }
}

export class AccessTokenResponse extends ApiResponse {
  constructor (message = Strings.GENERIC_ACCESS_TOKEN_ERROR) {
    super(StatusCode.UNAUTHORIZED, message)
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor (message = Strings.GENERIC_NOT_FOUND_ERROR) {
    super(StatusCode.NOT_FOUND, message)
  }
}
export class ForbiddenResponse extends ApiResponse {
  constructor (message = Strings.GENERIC_FORBIDDEN_ERROR) {
    super(StatusCode.FORBIDDEN, message)
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor (message = Strings.GENERIC_BAD_REQUEST_ERROR) {
    super(StatusCode.BAD_REQUEST, message)
  }
}

export class SuccessMessageResponse extends ApiResponse {
  constructor (message = Strings.GENERIC_SUCCESS) {
    super(StatusCode.SUCCESS, message)
  }
}

export class SuccessDataResponse<T> extends ApiResponse {
  constructor (message = Strings.GENERIC_SUCCESS, private data: T) {
    super(StatusCode.SUCCESS, message)
  }

  send (res: Response): Response {
    return super.prepare<SuccessDataResponse<T>>(res, this)
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor (message = Strings.GENERIC_ERROR) {
    super(StatusCode.INTERNAL_ERROR, message)
  }
}
