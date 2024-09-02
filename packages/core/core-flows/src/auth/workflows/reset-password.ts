import { MedusaError } from "@medusajs/utils"
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import jwt from "jsonwebtoken"
import { useRemoteQueryStep } from "../../common"
import { resetPasswordStep } from "../steps/reset-password"

type WorkflowInput = {
  provider: string
  entityId: string // e.g. email or phone number
  token: string
  password: string
}

type TokenPayload = {
  entity_id: string
  exp: number
}

const validateToken = createStep(
  "validate-token",
  async (input: { token: string; entityId: string; passwordHash: string }) => {
    const verified = jwt.verify(input.token, input.passwordHash) as TokenPayload

    const isExpired = verified.exp < Math.floor(Date.now() / 1000)
    const isInvalid = verified.entity_id !== input.entityId

    if (!verified || isExpired || isInvalid) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Invalid token`)
    }
  }
)

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

    validateToken({
      entityId: input.entityId,
      token: input.token,
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
