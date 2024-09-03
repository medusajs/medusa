import { AuthWorkflowEvents } from "@medusajs/utils"
import { createWorkflow } from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common"
import { generateTokenStep } from "../steps/generate-token"

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: { payload: { entity_id: string } & Record<string, unknown> }) => {
    const token = generateTokenStep(input.payload)

    emitEventStep({
      eventName: AuthWorkflowEvents.PASSWORD_RESET,
      data: { entity_id: input.payload.entity_id, token },
    })
  }
)
