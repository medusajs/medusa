import { SettingsTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface CreatePropertyLabelsStepInput {
  property_labels: {
    entity: string
    property: string
    label: string
    description?: string
  }[]
}

export const createPropertyLabelsStepId = "create-property-labels"

/**
 * @since 2.13.2
 * @featureFlag view_configurations
 */
export const createPropertyLabelsStep = createStep(
  createPropertyLabelsStepId,
  async (
    data: CreatePropertyLabelsStepInput,
    { container }
  ): Promise<StepResponse<SettingsTypes.PropertyLabelDTO[], string[]>> => {
    if (!data.property_labels?.length) {
      return new StepResponse([], [])
    }

    const service = container.resolve<SettingsTypes.ISettingsModuleService>(
      Modules.SETTINGS
    )

    const created = await service.createPropertyLabels(data.property_labels)
    const createdArray = Array.isArray(created) ? created : [created]

    return new StepResponse(
      createdArray,
      createdArray.map((c) => c.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<SettingsTypes.ISettingsModuleService>(
      Modules.SETTINGS
    )
    await service.deletePropertyLabels(createdIds)
  }
)
