import jwt from "jsonwebtoken"

export const generateJwtToken = (
  tokenPayload: Record<string, unknown>,
  jwtConfig: {
    secret: string
    expiresIn: string
  }
) => {
  return jwt.sign(tokenPayload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  })
}
