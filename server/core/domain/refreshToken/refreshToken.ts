export class RefreshToken {
  public userId: string;
  public token: string;
  public expires: Date;

  constructor (props: RefreshToken) {
    Object.assign(this, props)
  }
}
