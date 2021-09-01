export class Utils {
  static convertHoursToMilliseconds (hours: number): number {
    return hours * 60 * 60 * 1000
  }

  static convertTimestampToDate (timestamp: number): Date {
    return new Date(timestamp)
  }

  static convertTimestampToTimezoneBrazil (timestamp: number): Date {
    return new Date(timestamp - new Date().getTimezoneOffset() * 60000)
  }

  static formatTokenExpirationDate (expirationTime: number): Date {
    const timestamp = Date.now() + Utils.convertHoursToMilliseconds(expirationTime)

    return Utils.convertTimestampToTimezoneBrazil(timestamp)
  }
}
