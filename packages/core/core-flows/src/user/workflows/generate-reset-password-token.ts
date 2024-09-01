import { UserWorkflowEvents } from "@medusajs/utils"
import { createWorkflow, transform } from "@medusajs/workflows-sdk"
import jwt from "jsonwebtoken"
import { emitEventStep, useRemoteQueryStep } from "../../common"

const generateResetPasswordToken = async (input: {
  userId: string
  email: string
  passwordHash: string
}) => {
  const secret = input.passwordHash
  const expiry = Math.floor(Date.now() / 1000) + 60 * 15
  const payload = { user_id: input.userId, email: input.email, exp: expiry }
  const token = jwt.sign(payload, secret)

  return token
}

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: { email: string }) => {
    const user = useRemoteQueryStep({
      entry_point: "user",
      fields: ["id"],
      variables: {
        filters: {
          email: input.email,
        },
      },
      throw_if_key_not_found: true,
    })

    const authIdentity = useRemoteQueryStep({
      entry_point: "auth_identity",
      fields: ["id", "app_metadata"],
      variables: {
        filters: {
          email: input.email,
        },
      },
      throw_if_key_not_found: true,
    }).config({ name: "get-auth-identity" })

    const token = transform(
      {
        userId: user.id,
        email: user.email,
        passwordHash: authIdentity.provider_metadata.password,
      },
      generateResetPasswordToken
    )

    emitEventStep({
      eventName: UserWorkflowEvents.PASSWORD_RESET,
      data: { email: user.email, token },
    })
  }
)
