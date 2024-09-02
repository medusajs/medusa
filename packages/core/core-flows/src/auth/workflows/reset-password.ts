import { MedusaError } from "@medusajs/utils"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { resetPasswordStep } from "../steps/reset-password"
import { validateResetPasswordTokenStep } from "../steps/validate-reset-password-token"

type WorkflowInput = {
  provider: string
  entityId: string // e.g. email or phone number
  token: string
  password: string
}

export const resetPasswordWorkflow = createWorkflow(
  "reset-password",
  (input: WorkflowInput) => {
    const providerIdentities = useRemoteQueryStep({
      entry_point: "provider_identity",
      fields: ["id", "provider_metadata"],
      variables: {
        filters: {
          entity_id: input.entityId,
          provider: input.provider,
        },
      },
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

    validateResetPasswordTokenStep({
      entityId: input.entityId,
      token: input.token,
      providerIdentityId: providerIdentity.id,
      passwordHash: providerIdentity.provider_metadata.password,
    })

    const result = resetPasswordStep({
      provider: input.provider,
      providerIdentity,
      resetData: {
        body: {
          entityId: input.entityId,
          password: input.password,
        },
      },
    })

    return new WorkflowResponse(result)
  }
)
