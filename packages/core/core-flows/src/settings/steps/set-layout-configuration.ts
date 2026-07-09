import {
  LayoutConfigurationData,
  LayoutConfigurationDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type SetLayoutConfigurationStepInput = {
  zone: string
  user_id: string
  is_default?: boolean
  configuration: LayoutConfigurationData
}

export const setLayoutConfigurationStepId = "set-layout-configuration"

export const setLayoutConfigurationStep = createStep(
  setLayoutConfigurationStepId,
  async (input: SetLayoutConfigurationStepInput, { container }) => {
    const service = container.resolve(Modules.SETTINGS)

    const userIdFilter = input.is_default ? null : input.user_id
    const [previous] = await service.listLayoutConfigurations(
      { zone: input.zone, user_id: userIdFilter },
      { take: 1 }
    )

    const result: LayoutConfigurationDTO = input.is_default
      ? await service.setSystemDefaultLayoutConfiguration(
          input.zone,
          input.configuration
        )
      : await service.setLayoutConfiguration(
          input.zone,
          input.user_id,
          input.configuration
        )

    return new StepResponse(result, {
      zone: input.zone,
      user_id: input.user_id,
      is_default: !!input.is_default,
      previousConfiguration: previous?.configuration ?? null,
      createdId: previous ? null : result.id,
    })
  },
  async (compensateInput, { container }) => {
    if (!compensateInput) {
      return
    }

    const service = container.resolve(Modules.SETTINGS)

    if (compensateInput.previousConfiguration) {
      if (compensateInput.is_default) {
        await service.setSystemDefaultLayoutConfiguration(
          compensateInput.zone,
          compensateInput.previousConfiguration
        )
      } else {
        await service.setLayoutConfiguration(
          compensateInput.zone,
          compensateInput.user_id,
          compensateInput.previousConfiguration
        )
      }
    } else if (compensateInput.createdId) {
      await service.deleteLayoutConfigurations([compensateInput.createdId])
    }
  }
)
