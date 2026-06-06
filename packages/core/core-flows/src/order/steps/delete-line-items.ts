import type { IOrderModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of deleting order line items.
 */
export interface DeleteOrderLineItemsStepInput {
  /**
   * The IDs of the order line items to delete.
   */
  ids: string[]
}

/**
 * This step deletes order line items.
 */
export const deleteOrderLineItems = createStep(
  "delete-order-line-items",
  async (input: DeleteOrderLineItemsStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const deleted = await service.softDeleteOrderLineItems(input.ids)

    return new StepResponse(deleted, input.ids)
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.restoreOrderLineItems(ids)
  }
)
