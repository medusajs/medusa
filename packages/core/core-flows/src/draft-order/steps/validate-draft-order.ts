import { MedusaError, OrderStatus } from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"
import type { OrderDTO } from "@zjedene-medusa/framework/types"

/**
 * The details of the draft order to validate.
 */
export interface ValidateDraftOrderStepInput {
  /**
   * The draft order to validate.
   */
  order: OrderDTO
}

/**
 * This step validates that an order is a draft order. It throws an error otherwise.
 *
 * :::note
 *
 * You can retrieve a draft order's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = validateDraftOrderStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   }
 * })
 */
export const validateDraftOrderStep = createStep(
  "validate-draft-order",
  async function ({ order }: ValidateDraftOrderStepInput) {
    if (order.status !== OrderStatus.DRAFT && !order.is_draft_order) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order ${order.id} is not a draft order`
      )
    }
  }
)
