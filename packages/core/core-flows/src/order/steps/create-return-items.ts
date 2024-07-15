import { IOrderModuleService, OrderChangeActionDTO } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type CreateReturnItemsInput = {
  changes: OrderChangeActionDTO[]
  returnId: string
}

export const createReturnItems = createStep(
  "create-return-items",
  async (input: CreateReturnItemsInput, { container }) => {
    const orderModuleService = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const returnItems = input.changes.map((item) => {
      return {
        return_id: item.reference_id,
        item_id: item.details?.reference_id,
        quantity: item.details?.quantity as number,
        note: item.internal_note,
        metadata: (item.details?.metadata as Record<string, unknown>) ?? {},
      }
    })

    const [prevReturn] = await orderModuleService.listReturns(
      { id: input.returnId },
      {
        select: ["id"],
        relations: ["items"],
      }
    )

    const createdReturnItems = await orderModuleService.updateReturns([
      { selector: { id: input.returnId }, data: { items: returnItems } },
    ])

    return new StepResponse(createdReturnItems, prevReturn)
  },
  async (prevData, { container }) => {
    if (!prevData) {
      return
    }

    const orderModuleService = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await orderModuleService.updateReturns(
      { id: prevData.id },
      { items: prevData.items }
    )
  }
)
