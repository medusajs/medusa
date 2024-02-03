import jwt from "jsonwebtoken"
import { AuthUserDTO } from "@medusajs/types"

export const createAuthToken = (
  user: AuthUserDTO,
  jwtSecret: string
): string => {
  return jwt.sign(user, jwtSecret)
}
