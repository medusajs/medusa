import { SettingsTypes } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface UpdatePropertyLabelsStepInput {
  property_labels: {
    id: string
    label?: string
    description?: string
  }[]
}

interface UpdatePropertyLabelsCompensateData {
  previous: { id: string; label: string; description: string | null }[]
}

export const updatePropertyLabelsStepId = "update-property-labels"

/**
 * @since 2.13.2
 * @featureFlag view_configurations
 */
export const updatePropertyLabelsStep = createStep(
  updatePropertyLabelsStepId,
  async (
    data: UpdatePropertyLabelsStepInput,
    { container }
  ): Promise<
    StepResponse<
      SettingsTypes.PropertyLabelDTO[],
      UpdatePropertyLabelsCompensateData
    >
  > => {
    if (!data.property_labels?.length) {
      return new StepResponse([], { previous: [] })
    }

    const service = container.resolve<SettingsTypes.ISettingsModuleService>(
      Modules.SETTINGS
    )

    const ids = data.property_labels.map((p) => p.id)
    const existing = await service.listPropertyLabels({ id: ids })

    const previous = existing.map((e) => ({
      id: e.id,
      label: e.label,
      description: e.description,
    }))

    const updated = await service.updatePropertyLabels(data.property_labels)

    return new StepResponse(updated, { previous })
  },
  async (compensateData, { container }) => {
    if (!compensateData?.previous?.length) {
      return
    }

    const service = container.resolve<SettingsTypes.ISettingsModuleService>(
      Modules.SETTINGS
    )

    const restoreData = compensateData.previous.map((prev) => ({
      id: prev.id,
      label: prev.label,
      description: prev.description ?? undefined,
    }))

    await service.updatePropertyLabels(restoreData)
  }
)
