import { GrantType } from '../../../enums/grantType'

export class Authentication {
  public clientId: string;
  public clientSecret: string;
  public grantType: GrantType;

  constructor (props: Authentication) {
    Object.assign(this, props)
  }
}
