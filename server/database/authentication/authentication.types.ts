
export interface IAuthenticationRequest {
  clientId: string
  grantType: string
  token?: string
}

export interface IAuthenticationResponse {
  accessToken: string
  refreshToken: string
  tokenType?: string
}

export interface IAuthenticationPayload {
  clientId: string
}
