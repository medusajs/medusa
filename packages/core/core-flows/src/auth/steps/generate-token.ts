import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type StepInput = {
  entityId: string
}

export const generateTokenStep = createStep(
  "generate-token",
  async (input: StepInput, { container }) => {
    const authModule = container.resolve(ModuleRegistrationName.AUTH)

    const token = await authModule.generateToken({
      entity_id: input.entityId,
    })

    return new StepResponse(token)
  }
)
