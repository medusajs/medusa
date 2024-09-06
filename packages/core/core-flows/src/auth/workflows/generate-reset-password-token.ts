import {
  AuthWorkflowEvents,
  generateJwtToken,
  MedusaError,
} from "@medusajs/utils"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: {
    entityId: string
    provider: string
    secret: string
    expiry?: number
  }) => {
    const providerIdentities = useRemoteQueryStep({
      entry_point: "provider_identity",
      fields: ["auth_identity_id"],
      variables: {
        filters: {
          entity_id: input.entityId,
          provider: input.provider,
        },
      },
    })

    const token = transform(
      { input, providerIdentities },
      ({ input, providerIdentities }) => {
        const providerIdentity = providerIdentities?.[0]

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
            auth_identity_id: providerIdentity.auth_identity_id,
            provider: input.provider,
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

    return new WorkflowResponse(token)
  }
)
