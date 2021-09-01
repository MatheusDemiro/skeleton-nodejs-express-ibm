import { Collections } from '../../helpers/collections'
import { MongoDB } from '../mongodb'
import RefreshTokenSchema from './refreshToken.schema'
import { IRefreshTokenDocument, IRefreshTokenModel } from './refreshToken.types'

export const RefreshTokenModel = MongoDB.connection.model<
  IRefreshTokenDocument,
  IRefreshTokenModel
>(Collections.REFRESH_TOKEN_COLLECTION, RefreshTokenSchema)
