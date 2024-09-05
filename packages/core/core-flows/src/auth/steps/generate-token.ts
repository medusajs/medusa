import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export type GenerateTokenStepInput = {
  entityId: string
  provider: string
  secret: string
  expiry?: number
}

export const generateTokenStep = createStep(
  "generate-token",
  async (input: GenerateTokenStepInput, { container }) => {
    const authModule = container.resolve(ModuleRegistrationName.AUTH)

    const token = await authModule.generateToken(
      input.entityId,
      input.provider,
      {
        secret: input.secret,
        expiry: input.expiry,
      }
    )

    return new StepResponse(token)
  }
)
