import { AuthWorkflowEvents } from "@medusajs/utils"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common"
import { generateResetPasswordTokenStep } from "../steps/generate-reset-password-token"

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: { entityId: string; provider: string }) => {
    const token = generateResetPasswordTokenStep({
      provider: input.provider,
      entityId: input.entityId,
    })

    emitEventStep({
      eventName: AuthWorkflowEvents.PASSWORD_RESET,
      data: { to: input.entityId, token },
    })
  }
)
