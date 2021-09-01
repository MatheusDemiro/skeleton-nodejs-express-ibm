import { NextFunction } from 'express'

type AsyncFunction = () => Promise<any>;

export default (execution: AsyncFunction, next: NextFunction): void => {
  execution().catch(next)
}
