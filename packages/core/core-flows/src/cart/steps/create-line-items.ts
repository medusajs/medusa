import {
  CreateLineItemForCartDTO,
  ICartModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the line items to create.
 */
export interface CreateLineItemsCartStepInput {
  /**
   * The ID of the cart to create line items for.
   */
  id: string
  /**
   * The line items to create.
   */
  items: CreateLineItemForCartDTO[]
}

export const createLineItemsStepId = "create-line-items-step"
/**
 * This step creates line item in a cart.
 *
 * @example
 * const data = createLineItemsStep({
 *   "id": "cart_123",
 *   "items": [{
 *     "title": "Shirt",
 *     "quantity": 1,
 *     "unit_price": 20,
 *     "cart_id": "cart_123",
 *   }]
 * })
 */
export const createLineItemsStep = createStep(
  createLineItemsStepId,
  async (data: CreateLineItemsCartStepInput, { container }) => {
    const cartModule = container.resolve<ICartModuleService>(Modules.CART)

    const createdItems = data.items.length
      ? await cartModule.addLineItems(data.items)
      : []

    return new StepResponse(createdItems, createdItems)
  },
  async (createdItems, { container }) => {
    if (!createdItems?.length) {
      return
    }

    const cartModule: ICartModuleService = container.resolve(Modules.CART)

    await cartModule.deleteLineItems(createdItems.map((c) => c.id))
  }
)
