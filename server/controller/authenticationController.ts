import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { Request, Response, NextFunction } from 'express'
import { AuthFailureError, BadRequestError, RefreshTokenError } from '../core/logic/apiError'
import { SuccessDataResponse, SuccessMessageResponse } from '../core/logic/apiResponse'
import { IAuthenticationPayload, IAuthenticationRequest, IAuthenticationResponse } from '../database/authentication/authentication.types'
import { IRefreshToken } from '../database/refreshToken/refreshToken.types'
import { GrantType } from '../enums/grantType'
import asyncHandler from '../helpers/asyncHandler'
import { Utils } from '../helpers/utils'
import { RefreshTokenModel } from '../database/refreshToken/refreshToken.model'

export class AuthenticationController {
    private static instance: AuthenticationController;
    private refreshTokenDurantionFormatted: number

    public static getInstance (): AuthenticationController {
      if (!AuthenticationController.instance) {
        this.instance = new AuthenticationController()
      }
      return AuthenticationController.instance
    }

    public async getAccessToken (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      asyncHandler(async () => {
        const authenticationRequest: IAuthenticationRequest = {
          clientId: req.body.clientId,
          grantType: req.body.grantType
        }
        if (
          authenticationRequest.grantType !== GrantType.AUTHORIZATION_CODE
        ) { throw new BadRequestError() }

        const authenticationResponse = await this.token(authenticationRequest)

        return new SuccessDataResponse<IAuthenticationResponse>(
          undefined,
          authenticationResponse
        ).send(res)
      }, next)
    }

    public async getRefreshToken (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      asyncHandler(async () => {
        const authenticationRequest: IAuthenticationRequest = {
          clientId: req.body.clientId,
          grantType: req.body.grantType,
          token: req.body.token
        }

        if (
          authenticationRequest.grantType !== GrantType.REFRESH_TOKEN ||
            authenticationRequest.clientId == null
        ) { throw new BadRequestError() }

        const authenticationResponse = await this.refreshToken(
          authenticationRequest
        )

        return new SuccessDataResponse<IAuthenticationResponse>(
          undefined,
          authenticationResponse
        ).send(res)
      }, next)
    }

    public async logout (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      asyncHandler(async () => {
        const authenticationRequest: IAuthenticationRequest = req.body

        if (!authenticationRequest.token) throw new BadRequestError()

        const refreshTokenPersistence = await RefreshTokenModel.findOne({
          token: authenticationRequest.token
        })

        if (!refreshTokenPersistence) throw new RefreshTokenError()

        await RefreshTokenModel.deleteOne({ token: authenticationRequest.token })

        return new SuccessMessageResponse(undefined).send(res)
      }, next)
    }

    private async token (
      authenticationRequest: IAuthenticationRequest
    ): Promise<IAuthenticationResponse> {
      const credentials = await this.getCredentials(
        authenticationRequest.clientId
      )
      const refreshTokenEntity: IRefreshToken = {
        clientId: authenticationRequest.clientId,
        token: credentials.refreshToken,
        expires: Utils.formatTokenExpirationDate(
          this.refreshTokenDurantionFormatted
        )
      }

      await RefreshTokenModel.createOrUpdate(refreshTokenEntity)

      return credentials
    }

    private async refreshToken (
      authenticationRequest: IAuthenticationRequest
    ): Promise<IAuthenticationResponse> {
      if (authenticationRequest.token == null) throw new AuthFailureError()

      const refreshTokenPersistence = await RefreshTokenModel.findOne({
        token: authenticationRequest.token
      })
      if (!refreshTokenPersistence) throw new RefreshTokenError()

      const decode = jwt.verify(
        refreshTokenPersistence.token,
        fs.readFileSync(
          path.join(__dirname, '../../keys/publicRefresh.key'),
          'utf8'
        ),
        { algorithms: ['RS256'] }
      ) as IRefreshToken
      const authenticationResponse = await this.getCredentials(
        decode.clientId
      )

      const refreshTokenEntity: IRefreshToken = {
        clientId: authenticationRequest.clientId,
        token: authenticationResponse.refreshToken,
        expires: refreshTokenPersistence.expires
      }

      await RefreshTokenModel.createOrUpdate(refreshTokenEntity)

      return authenticationResponse
    }

    private async getCredentials (
      clientId: string
    ): Promise<IAuthenticationResponse> {
      const accessToken = this.generateAccessToken({
        clientId: clientId
      })
      const refreshToken = this.generateRefreshToken({
        clientId: clientId
      })

      return {
        accessToken: accessToken,
        refreshToken: refreshToken
      } as IAuthenticationResponse
    }

    private generateRefreshToken (payload: IAuthenticationPayload): string {
      return jwt.sign(
        payload,
        fs.readFileSync(
          path.join(__dirname, '../../keys/privateRefresh.key'),
          'utf8'
        ),
        {
          expiresIn: process.env.REFRESH_TOKEN_VALIDITY_HOURS,
          algorithm: 'RS256'
        }
      )
    }

    private generateAccessToken (payload: IAuthenticationPayload): string {
      return jwt.sign(
        payload,
        fs.readFileSync(
          path.join(__dirname, '../../keys/privateAccess.key'),
          'utf8'
        ),
        {
          expiresIn: process.env.ACCESS_TOKEN_VALIDITY_HOURS,
          algorithm: 'RS256'
        }
      )
    }
}
