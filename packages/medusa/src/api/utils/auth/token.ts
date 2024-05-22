import { AuthContext } from "../../../types/routing"
import jwt from "jsonwebtoken"

export const generateJwtToken = (
  authContext: AuthContext,
  jwtConfig: {
    secret: string
    expiresIn: string
  }
) => {
  return jwt.sign(authContext, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  })
}
