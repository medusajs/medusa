import { CreateOrderLineItemDTO } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  items: CreateOrderLineItemDTO[]
}

export const createOrderLineItemsStepId = "create-line-items-step"
export const createOrderLineItemsStep = createStep(
  createOrderLineItemsStepId,
  async (input: StepInput, { container }) => {
    const orderModule = container.resolve(ModuleRegistrationName.ORDER)

    const createdItems = input.items.length
      ? await orderModule.createLineItems(input.items)
      : []

    return new StepResponse(
      createdItems,
      createdItems.map((c) => c.id)
    )
  },
  async (itemIds, { container }) => {
    if (!itemIds?.length) {
      return
    }

    const orderModule = container.resolve(ModuleRegistrationName.ORDER)

    await orderModule.deleteLineItems(itemIds)
  }
)
