import type { CreateOrderLineItemDTO } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of creating order line items.
 */
export interface CreateOrderLineItemsStepInput {
  /**
   * The items to create.
   */
  items: CreateOrderLineItemDTO[]
}

export const createOrderLineItemsStepId = "create-order-line-items-step"
/**
 * This step creates order line items.
 *
 * @example
 * const data = createOrderLineItemsStep({
 *   items: [
 *     {
 *       variant_id: "variant_123",
 *       quantity: 1,
 *       unit_price: 10,
 *       title: "Shirt",
 *       order_id: "order_123"
 *     }
 *   ]
 * })
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
