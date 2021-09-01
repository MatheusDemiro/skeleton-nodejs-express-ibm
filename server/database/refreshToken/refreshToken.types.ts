import { Document, Model } from 'mongoose'

export interface IRefreshToken {
  clientId: string
  token: string
  expires: Date
}

export interface IRefreshTokenDocument extends IRefreshToken, Document {}

export interface IRefreshTokenModel extends Model<IRefreshTokenDocument> {
  findOrCreate: (
    this: IRefreshTokenModel,
    refreshToken: IRefreshToken
  ) => Promise<IRefreshTokenDocument>
  createOrUpdate: (
    this: IRefreshTokenModel,
    refreshToken: IRefreshToken
  ) => Promise<IRefreshTokenDocument>
}
