import { IOrderModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export interface DeleteOrderShippingMethodsStepInput {
  ids: string[]
}

/**
 * This step deletes order shipping methods.
 */
export const deleteOrderShippingMethods = createStep(
  "delete-order-shipping-methods",
  async (input: DeleteOrderShippingMethodsStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const deleted = await service.softDeleteOrderShippingMethods(input.ids)

    return new StepResponse(deleted, input.ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.restoreOrderShippingMethods(ids)
  }
)
