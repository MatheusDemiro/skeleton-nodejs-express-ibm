import fs from 'fs'
import path from 'path'
import mongoose, { Connection } from 'mongoose'

interface ConnectionConfiguration {
  useNewUrlParser: boolean,
  useUnifiedTopology: boolean,
  ssl: boolean,
  sslValidate: boolean,
  sslCA: Buffer[]
}

export class MongoDB {
  private static instance: MongoDB
  public static connection: Connection
  public uri: string
  private configuration: ConnectionConfiguration;

  private constructor () {
    this.uri = process.env.MONGO_DB_URI
    const pathCa = path.join(__dirname, '/ca.pem')

    this.configuration = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      sslCA: [fs.readFileSync(pathCa)]
    }
  }

  public static getInstance (): MongoDB {
    if (!MongoDB.instance) {
      this.instance = new MongoDB()
      this.connection = this.instance.getDatabaseByName()
    }
    return MongoDB.instance
  }

  public async connect (): Promise<void> {
    await mongoose.connect(this.uri, this.configuration)
      .then(() => {
        console.log('Connected to database.')
      }).catch((err) => {
        console.log(`Error connected to database:${err.message}`)
      })
  }

  public getDatabaseByName (name?: string): mongoose.Connection {
    const databaseName = name || process.env.DATABASE_NAME

    return mongoose.connection.useDb(databaseName)
  }
}
