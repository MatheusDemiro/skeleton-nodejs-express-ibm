import { IRefreshTokenModel } from '../../../../database/models/refreshTokenModel'
import { RefreshToken } from '../refreshToken'

export class RefreshTokenMap {
  public static toPersistence (data: RefreshToken): IRefreshTokenModel {
    const refreshTokenPersistence: IRefreshTokenModel = {} as IRefreshTokenModel
    Object.assign(refreshTokenPersistence, data)
    return refreshTokenPersistence
  }
}
