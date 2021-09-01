// loading environment
import './settings'
import './database/index'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { ApiError, InternalError, NotFoundError } from './core/logic/apiError'
import authenticationRouter from './routes/authenticationRouter'

class App {
  public express: express.Application

  public constructor () {
    this.express = express()

    this.middlewares()
    this.routes()
    this.middlewaresErros()
  }

  private middlewares (): void {
    this.express.use(helmet())
    this.express.use(cors())
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: false }))
  }

  private middlewaresErros (): void {
    // handle code error 404
    this.express.use((req: Request, res: Response, next: NextFunction) =>
      next(new NotFoundError())
    )

    // handle any error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.express.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ApiError) {
          ApiError.handle(err, res)
        } else {
          console.log(err.message)
          ApiError.handle(new InternalError(), res)
        }
      }
    )
  }

  private routes (): void {
    this.express.use('/api/auth', express.urlencoded({ extended: true }), authenticationRouter)
  }
}

export default new App().express
