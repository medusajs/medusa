import {
  CreateOrderReturnItemDTO,
  IOrderModuleService,
  OrderChangeActionDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateReturnItemsInput = {
  changes: OrderChangeActionDTO[]
  returnId: string
}

export const createReturnItemsStep = createStep(
  "create-return-items",
  async (input: CreateReturnItemsInput, { container }) => {
    const orderModuleService = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
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
      ModuleRegistrationName.ORDER
    )

    await orderModuleService.deleteReturnItems(ids)
  }
)
