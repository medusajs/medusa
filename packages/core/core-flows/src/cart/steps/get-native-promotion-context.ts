import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"
import {
  getPromotionContextTimezone,
  getTimeContext,
} from "../utils/promotion-context"

/**
 * The input of the {@link getNativePromotionContextStep}.
 */
export interface GetNativePromotionContextStepInput {
  /**
   * The cart to derive the promotion context from.
   */
  cart: {
    customer_id?: string | null
    [key: string]: unknown
  }
}

export const getNativePromotionContextStepId = "get-native-promotion-context"

/**
 * This step computes the dynamic attributes that the native promotion rule
 * engine can evaluate against a cart but that are not directly available on the
 * cart entity:
 *
 * - `is_logged_in` - whether the cart belongs to a registered customer.
 * - `customer_order_count` - the number of orders the customer has placed,
 *   enabling first-order / new-vs-existing-customer rules.
 * - `current_day_of_week` / `current_minutes` - the store's local day/time,
 *   enabling day-of-week and time-of-day windows. The timezone is configurable
 *   via the `MEDUSA_PROMOTION_TIMEZONE` env var (defaults to UTC).
 *
 * The result is merged into the promotion rule evaluation context by the
 * {@link updateCartPromotionsWorkflow}.
 */
export const getNativePromotionContextStep = createStep(
  getNativePromotionContextStepId,
  async (input: GetNativePromotionContextStepInput, { container }) => {
    const cart = input.cart ?? ({} as GetNativePromotionContextStepInput["cart"])
    const customerId = cart.customer_id

    let customerOrderCount = 0

    if (customerId) {
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const { metadata } = await query.graph({
        entity: "order",
        fields: ["id"],
        filters: { customer_id: customerId },
        pagination: { take: 1, skip: 0 },
      })

      customerOrderCount = metadata?.count ?? 0
    }

    const { current_day_of_week, current_minutes } = getTimeContext(
      new Date(),
      getPromotionContextTimezone()
    )

    return new StepResponse({
      is_logged_in: !!customerId,
      customer_order_count: customerOrderCount,
      current_day_of_week,
      current_minutes,
    })
  }
)
