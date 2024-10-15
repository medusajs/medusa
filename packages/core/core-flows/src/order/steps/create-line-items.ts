import { CreateOrderLineItemDTO } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface CreateOrderLineItemsStepInput {
  items: CreateOrderLineItemDTO[]
}

export const createOrderLineItemsStepId = "create-order-line-items-step"
/**
 * This step creates order line items.
 */
export const createOrderLineItemsStep = createStep(
  createOrderLineItemsStepId,
  async (input: CreateOrderLineItemsStepInput, { container }) => {
    const orderModule = container.resolve(Modules.ORDER)

    const createdItems = input.items.length
      ? await orderModule.createOrderLineItems(input.items)
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

    const orderModule = container.resolve(Modules.ORDER)

    await orderModule.deleteOrderLineItems(itemIds)
  }
)
