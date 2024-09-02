import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  entityId: string
  providerIdentityId: string
  passwordHash: string
}

export const generateResetPasswordTokenStep = createStep(
  "generate-reset-password-token",
  async (input: StepInput, { container }) => {
    const authModule = container.resolve(ModuleRegistrationName.AUTH)

    
  }
)
