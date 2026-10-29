import jwt, { type Secret, type SignOptions } from "jsonwebtoken"
import { MedusaError } from "../common"

export const generateJwtToken = (
  tokenPayload: Record<string, unknown>,
  jwtConfig: {
    secret?: Secret
    expiresIn?: number | string
    jwtOptions?: SignOptions
  }
) => {
  if (
    !jwtConfig.secret ||
    (!jwtConfig.expiresIn && !jwtConfig.jwtOptions?.expiresIn)
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      "JWT secret and expiresIn must be provided when generating a token"
    )
  }

  const expiresIn = (jwtConfig.expiresIn ??
    jwtConfig.jwtOptions?.expiresIn) as SignOptions["expiresIn"]
  return jwt.sign(tokenPayload, jwtConfig.secret, {
    ...jwtConfig.jwtOptions,
    expiresIn,
  })
}
