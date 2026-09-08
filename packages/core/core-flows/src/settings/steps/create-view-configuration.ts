import {
  CreateViewConfigurationDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to create a view configuration.
 */
export type CreateViewConfigurationStepInput = CreateViewConfigurationDTO

export const createViewConfigurationStepId = "create-view-configuration"

/**
 * This step creates a view configuration.
 *
 * @since 2.10.3
 * @featureFlag view_configurations
 *
 * @example
 * const viewConfig = createViewConfigurationStep({
 *   entity: "orders",
 *   name: "My Orders View",
 *   configuration: {
 *     visible_columns: ["display_id", "status"],
 *     column_order: ["display_id", "status"],
 *   },
 * })
 */
export const createViewConfigurationStep = createStep(
  createViewConfigurationStepId,
  async (data: CreateViewConfigurationStepInput, { container }) => {
    const service = container.resolve(Modules.SETTINGS)
    const created = await service.createViewConfigurations(data)
    
    return new StepResponse(created, { id: created.id })
  },
  async (compensateInput, { container }) => {
    if (!compensateInput?.id) {
      return
    }

    const service = container.resolve(Modules.SETTINGS)
    await service.deleteViewConfigurations([compensateInput.id])
  }
)
