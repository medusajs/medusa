import { MedusaError, UserWorkflowEvents } from "@medusajs/utils"
import { createWorkflow, transform } from "@medusajs/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: { entityId: string; provider: string }) => {
    const providerIdentities = useRemoteQueryStep({
      entry_point: "provider_identity",
      fields: ["id", "provider_metadata"],
      variables: {
        filters: {
          entity_id: input.entityId,
          provider: input.provider,
        },
      },
      throw_if_key_not_found: true,
    }).config({ name: "get-provider-identities" })

    const providerIdentity = transform(
      { providerIdentities, input },
      ({ providerIdentities, input }) => {
        const providerIdentity = providerIdentities[0]

        if (!providerIdentity) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Provider identity with entity_id ${input.entityId} and provider ${input.provider} not found`
          )
        }

        return providerIdentity
      }
    )

    const token = transform(
      {
        entityId: input.entityId,
        providerIdentityId: providerIdentity.id,
        passwordHash: providerIdentity?.provider_metadata.password,
      },
      generateResetPasswordToken
    )

    emitEventStep({
      eventName: UserWorkflowEvents.PASSWORD_RESET,
      data: { to: input.entityId, token },
    })
  }
)
