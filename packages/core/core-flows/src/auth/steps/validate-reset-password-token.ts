import { MedusaError } from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"
import jwt from "jsonwebtoken"

type TokenPayload = {
  entity_id: string
  provider_identity_id: string
  exp: number
}

export const validateResetPasswordTokenStep = createStep(
  "validate-reset-password-token",
  async (input: {
    token: string
    entityId: string
    providerIdentityId: string
    passwordHash: string
  }) => {
    const verified = jwt.verify(input.token, input.passwordHash) as TokenPayload

    const isExpired = verified.exp < Date.now()
    const isInvalid =
      verified.entity_id !== input.entityId ||
      verified.provider_identity_id !== input.providerIdentityId

    if (!verified || isExpired || isInvalid) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Invalid token`)
    }
  }
)
