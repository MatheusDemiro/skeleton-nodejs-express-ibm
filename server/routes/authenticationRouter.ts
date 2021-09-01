import { NextFunction, Request, Response, Router } from 'express'
import { AuthenticationController } from '../controller/authenticationController'

class AuthenticationRouter {
  public router: Router

  public constructor () {
    this.router = Router()
    this.init()
  }

  private async accessToken (req: Request, res: Response, next: NextFunction) {
    return AuthenticationController.getInstance().getAccessToken(req, res, next)
  }

  private async refreshToken (req: Request, res: Response, next: NextFunction) {
    return AuthenticationController.getInstance().getRefreshToken(req, res, next)
  }

  private async logout (req: Request, res: Response, next: NextFunction) {
    return AuthenticationController.getInstance().logout(req, res, next)
  }

  public init (): void {
    this.router.post('/token', this.accessToken)
    this.router.post('/refresh-token', this.refreshToken)
    this.router.post('/logout', this.logout)
  }
}

const authenticationRouter = new AuthenticationRouter()

export default authenticationRouter.router
