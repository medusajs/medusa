import {
  CreateOrderReturnItemDTO,
  IOrderModuleService,
  OrderChangeActionDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type CreateReturnItemsFromActionsInput = {
  changes: OrderChangeActionDTO[]
  returnId: string
}

/**
 * This step creates return items from change actions.
 */
export const createReturnItemsFromActionsStep = createStep(
  "create-return-items-from-change-actions",
  async (input: CreateReturnItemsFromActionsInput, { container }) => {
    const orderModuleService = container.resolve<IOrderModuleService>(
      Modules.ORDER
    )

    const returnItems = input.changes.map((item) => {
      return {
        return_id: input.returnId,
        item_id: item.details?.reference_id! as string,
        reason_id: item.details?.reason_id,
        quantity: item.details?.quantity as number,
        note: item.internal_note,
        metadata: (item.details?.metadata as Record<string, unknown>) ?? {},
      } as CreateOrderReturnItemDTO
    })

    const createdReturnItems = await orderModuleService.createReturnItems(
      returnItems
    )

    return new StepResponse(
      createdReturnItems,
      createdReturnItems.map((i) => i.id)
    )
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const orderModuleService = container.resolve<IOrderModuleService>(
      Modules.ORDER
    )

    await orderModuleService.deleteReturnItems(ids)
  }
)
