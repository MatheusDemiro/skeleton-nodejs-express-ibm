
export class AuthenticationResponse {
  public accessToken: string;
  public refreshToken: string;
  public tokenType?: string;

  constructor (props: AuthenticationResponse) {
    this.tokenType = 'bearer'
    Object.assign(this, props)
  }
}
