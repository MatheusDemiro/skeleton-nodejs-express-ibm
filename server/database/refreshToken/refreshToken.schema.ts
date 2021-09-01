import { Schema } from 'mongoose'
import { Collections } from '../../helpers/collections'
import { IRefreshTokenDocument, IRefreshTokenModel } from './refreshToken.types'

const RefreshTokenSchema = new Schema<
  IRefreshTokenDocument,
  IRefreshTokenModel
>(
  {
    clientId: {
      type: Schema.Types.String,
      required: true
    },
    token: {
      type: Schema.Types.String,
      required: true
    },
    expires: {
      type: Schema.Types.Date,
      required: true
    }
  },
  { versionKey: false, collection: Collections.REFRESH_TOKEN_COLLECTION }
)

RefreshTokenSchema.index({ cliendId: -1 }, { unique: true })

export default RefreshTokenSchema
