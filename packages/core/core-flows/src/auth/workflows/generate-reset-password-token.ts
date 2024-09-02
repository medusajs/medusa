import { MedusaError, UserWorkflowEvents } from "@medusajs/utils"
import { createWorkflow, transform } from "@medusajs/workflows-sdk"
import jwt from "jsonwebtoken"
import { emitEventStep, useRemoteQueryStep } from "../../common"

const generateResetPasswordToken = async (input: {
  entityId: string
  email: string
  passwordHash: string
}) => {
  const secret = input.passwordHash
  const expiry = Math.floor(Date.now() / 1000) + 60 * 15
  const payload = { entity_id: input.entityId, email: input.email, exp: expiry }
  const token = jwt.sign(payload, secret)

  return token
}

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: { email: string }) => {
    const providerIdentities = useRemoteQueryStep({
      entry_point: "provider_identity",
      fields: ["id", "provider_metadata"],
      variables: {
        filters: {
          entity_id: input.email,
          provider: "emailpass",
        },
      },
      throw_if_key_not_found: true,
    }).config({ name: "get-provider-identities" })

    const passwordHash = transform(
      { providerIdentities, input },
      ({ providerIdentities, input }) => {
        const providerIdentity = providerIdentities[0]

        if (!providerIdentity) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Emailpass auth identity with email ${input.email} not found`
          )
        }

        return providerIdentity?.provider_metadata.password
      }
    )

    const token = transform(
      {
        entityId: input.email,
        email: input.email,
        passwordHash,
      },
      generateResetPasswordToken
    )

    emitEventStep({
      eventName: UserWorkflowEvents.PASSWORD_RESET,
      data: { email: input.email, token },
    })
  }
)
