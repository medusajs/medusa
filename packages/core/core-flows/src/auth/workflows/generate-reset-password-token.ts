import { AuthWorkflowEvents } from "@medusajs/utils"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common"
import { generateTokenStep } from "../steps/generate-token"

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: {
    entityId: string
    provider: string
    secret: string
    expiry?: number
  }) => {
    const token = generateTokenStep({
      entityId: input.entityId,
      provider: input.provider,
      secret: input.secret,
      expiry: input.expiry,
    })

    emitEventStep({
      eventName: AuthWorkflowEvents.PASSWORD_RESET,
      data: { entity_id: input.entityId, token },
    })
  }
)
