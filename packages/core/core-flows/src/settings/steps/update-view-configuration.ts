import {
  UpdateViewConfigurationDTO,
  ViewConfigurationDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The input for updating a view configuration.
 */
export type UpdateViewConfigurationStepInput = {
  /**
   * The ID of the view configuration to update.
   */
  id: string
  /**
   * The attributes to update in the view configuration.
   */
  data: UpdateViewConfigurationDTO
}

export const updateViewConfigurationStepId = "update-view-configuration"

/**
 * This step updates a view configuration. Before updating, it retrieves the
 * configuration's current state so that it can be restored if the workflow fails.
 *
 * @since 2.10.3
 * @featureFlag view_configurations
 *
 * @example
 * const viewConfig = updateViewConfigurationStep({
 *   id: "viewconfig_123",
 *   data: {
 *     name: "Updated View",
 *   },
 * })
 */
export const updateViewConfigurationStep = createStep(
  updateViewConfigurationStepId,
  async (input: UpdateViewConfigurationStepInput, { container }) => {
    const service = container.resolve(Modules.SETTINGS)

    const currentState = await service.retrieveViewConfiguration(input.id)

    const updated = await service.updateViewConfigurations(input.id, input.data)

    return new StepResponse(updated, {
      id: input.id,
      previousState: currentState,
    })
  },
  async (compensateInput, { container }) => {
    if (!compensateInput?.id || !compensateInput?.previousState) {
      return
    }

    const service = container.resolve(Modules.SETTINGS)

    const { id, created_at, updated_at, ...restoreData } =
      compensateInput.previousState as ViewConfigurationDTO
    await service.updateViewConfigurations(compensateInput.id, restoreData)
  }
)
