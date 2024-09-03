import { AuthWorkflowEvents } from "@medusajs/utils"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common"
import { generateTokenStep } from "../steps/generate-token"

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: { entityId: string }) => {
    const token = generateTokenStep({
      entityId: input.entityId,
    })

    emitEventStep({
      eventName: AuthWorkflowEvents.PASSWORD_RESET,
      data: { entity_id: input.entityId, token },
    })
  }
)
