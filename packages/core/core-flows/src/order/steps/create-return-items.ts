import {
  IOrderModuleService,
  OrderChangeActionDTO,
  UpdateReturnDTO,
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
        return_id: item.reference_id,
        item_id: item.details?.reference_id,
        reason_id: item.details?.reason_id,
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
      {
        selector: { id: input.returnId },
        data: { items: returnItems as UpdateReturnDTO["items"] },
      },
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
