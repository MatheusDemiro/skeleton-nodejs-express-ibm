import { MongoDB } from './mongodb'

const db = MongoDB.getInstance()

export default db.connect()
