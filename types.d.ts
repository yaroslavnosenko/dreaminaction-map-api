import { User } from './src/database/models'

declare module 'express' {
  interface Request {
    user?: User | null
  }
}
