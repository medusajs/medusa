import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const generateTokenStep = createStep(
  "generate-token",
  async (input: Record<string, unknown>, { container }) => {
    const authModule = container.resolve(ModuleRegistrationName.AUTH)

    const token = await authModule.generateToken(input)

    return new StepResponse(token)
  }
)
