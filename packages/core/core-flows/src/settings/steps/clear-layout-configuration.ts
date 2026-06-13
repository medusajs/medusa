import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type ClearLayoutConfigurationStepInput = {
  zone: string
  user_id: string
}

export const clearLayoutConfigurationStepId = "clear-layout-configuration"

export const clearLayoutConfigurationStep = createStep(
  clearLayoutConfigurationStepId,
  async (input: ClearLayoutConfigurationStepInput, { container }) => {
    const service = container.resolve(Modules.SETTINGS)

    const [previous] = await service.listLayoutConfigurations(
      { zone: input.zone, user_id: input.user_id },
      { take: 1 }
    )

    await service.clearLayoutConfiguration(input.zone, input.user_id)

    return new StepResponse(void 0, {
      zone: input.zone,
      user_id: input.user_id,
      previousConfiguration: previous?.configuration ?? null,
    })
  },
  async (compensateInput, { container }) => {
    if (!compensateInput?.previousConfiguration) {
      return
    }

    const service = container.resolve(Modules.SETTINGS)

    await service.setLayoutConfiguration(
      compensateInput.zone,
      compensateInput.user_id,
      compensateInput.previousConfiguration
    )
  }
)
