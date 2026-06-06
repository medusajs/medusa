import type { IOrderModuleService } from "@zjedene-medusa/framework/types"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"
import { Modules } from "@zjedene-medusa/framework/utils"

/**
 * The details of canceling the orders.
 */
export type DeleteDraftOrdersStepInput = {
  /**
   * The IDs of the orders to delete.
   */
  orderIds: string[]
}

export const deleteDraftOrdersStepId = "delete-draft-orders"
/**
 * This step deletes one or more draft orders.
 */
export const deleteDraftOrdersStep = createStep(
  deleteDraftOrdersStepId,
  async (data: DeleteDraftOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteOrders(data.orderIds)
  }
)
