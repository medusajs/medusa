import { FlagRouter } from "@medusajs/utils"
import { AwilixContainer } from "awilix"
import { EntityManager } from "typeorm"
import { Cart, LineItem } from "../../../../../../models"
import { CartService } from "../../../../../../services"
import { WithRequiredProperty } from "../../../../../../types/common"
import { IdempotencyCallbackResult } from "../../../../../../types/idempotency-key"

export const CreateLineItemSteps = {
  STARTED: "started",
  FINISHED: "finished",
}

export async function handleAddOrUpdateLineItem(
  cartId: string,
  {
    cart,
    line,
  }: {
    cart: Cart
    line: LineItem
  },
  { container, manager }: { container: AwilixContainer; manager: EntityManager }
): Promise<IdempotencyCallbackResult> {
  const cartService: CartService = container.resolve("cartService")
  const featureFlagRouter: FlagRouter = container.resolve("featureFlagRouter")

  const txCartService = cartService.withTransaction(manager)

  await txCartService.addOrUpdateLineItems(cart.id, line, {
    validateSalesChannels: featureFlagRouter.isFeatureEnabled("sales_channels"),
  })

  if (cart.payment_sessions?.length) {
    await txCartService.setPaymentSessions(
      cart as WithRequiredProperty<Cart, "total">
    )
  }

  return {
    response_code: 200,
    response_body: { cart },
  }
}
