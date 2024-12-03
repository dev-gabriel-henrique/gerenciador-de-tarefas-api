import { env } from '../env'

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expires_in: "1d"
  }
}