import {
  IRefreshToken,
  IRefreshTokenDocument,
  IRefreshTokenModel
} from './refreshToken.types'

export async function findOneOrCreate (
  this: IRefreshTokenModel,
  refreshToken: IRefreshToken
): Promise<IRefreshTokenDocument> {
  const record = await this.findOne({ clientId: refreshToken.clientId })

  if (record) {
    return record
  } else {
    return this.create(refreshToken)
  }
}

export async function createOrUpdate (
  this: IRefreshTokenModel,
  refreshToken: IRefreshToken
): Promise<IRefreshTokenDocument> {
  const record = await this.findOne({
    $or: [
      { clientId: { $eq: refreshToken.clientId } },
      { token: { $eq: refreshToken.token } }
    ]
  })

  if (record) {
    return this.updateOne({ clientId: refreshToken.clientId }, refreshToken)
  } else {
    return this.create(refreshToken)
  }
}
