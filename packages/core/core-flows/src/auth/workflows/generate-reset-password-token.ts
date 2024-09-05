import {
  AuthWorkflowEvents,
  generateJwtToken,
  MedusaError,
} from "@medusajs/utils"
import { createWorkflow, transform } from "@medusajs/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: {
    entityId: string
    provider: string
    secret: string
    expiry?: number
  }) => {
    const providerIdentity = useRemoteQueryStep({
      entry_point: "provider_identity",
      fields: ["auth_identity.id"],
      variables: {
        filters: {
          entity_id: input.entityId,
          provider: input.provider,
        },
      },
    })

    const token = transform(
      { input, providerIdentity },
      ({ input, providerIdentity }) => {
        if (!providerIdentity) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Provider identity required to generate token"
          )
        }

        if (!input.secret) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Secret required to generate a token"
          )
        }

        const token = generateJwtToken(
          {
            auth_identity_id: providerIdentity.id,
          },
          { secret: input.secret, expiresIn: "15m" }
        )

        return token
      }
    )

    emitEventStep({
      eventName: AuthWorkflowEvents.PASSWORD_RESET,
      data: { entity_id: input.entityId, token },
    })
  }
)
