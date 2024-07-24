import { User } from './src/database'

declare module 'express' {
  interface Request {
    user?: User | null
  }
}
