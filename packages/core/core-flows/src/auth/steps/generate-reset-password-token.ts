import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type StepInput = {
  provider: string
  entityId: string
}

export const generateResetPasswordTokenStep = createStep(
  "generate-reset-password-token",
  async (input: StepInput, { container }) => {
    const authModule = container.resolve(ModuleRegistrationName.AUTH)

    const token = await authModule.generateResetPasswordToken(
      input.provider,
      input.entityId
    )

    return new StepResponse(token)
  }
)
