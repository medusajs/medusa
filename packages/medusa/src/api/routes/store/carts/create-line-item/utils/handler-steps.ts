import { Cart } from "../../../../../../models"
import {
  CartService,
  LineItemService,
  ProductVariantInventoryService,
} from "../../../../../../services"
import { WithRequiredProperty } from "../../../../../../types/common"
import SalesChannelFeatureFlag from "../../../../../../loaders/feature-flags/sales-channels"
import { featureFlagRouter } from "../../../../../../loaders/feature-flags"

export const CreateLineItemSteps = {
  STARTED: "started",
  SET_PAYMENT_SESSIONS: "set-payment-sessions",
  FINISHED: "finished",
}

export async function addOrUpdateLineItem({
  cartId,
  container,
  manager,
  data,
}) {
  const cartService: CartService = container.resolve("cartService")
  const lineItemService: LineItemService = container.resolve("lineItemService")

  const cart = await cartService.retrieve(cartId, {
    select: ["id", "region_id", "customer_id"],
  })

  const line = await lineItemService
    .withTransaction(manager)
    .generate(data.variant_id, cart.region_id, data.quantity, {
      customer_id: data.customer_id || cart.customer_id,
      metadata: data.metadata,
    })

  await manager.transaction(async (transactionManager) => {
    const txCartService = cartService.withTransaction(transactionManager)

    await txCartService.addOrUpdateLineItems(cart.id, line, {
      validateSalesChannels:
        featureFlagRouter.isFeatureEnabled("sales_channels"),
    })
  })
}

export async function setPaymentSession({ cart, container, manager }) {
  const cartService: CartService = container.resolve("cartService")

  const txCartService = cartService.withTransaction(manager)

  if (!cart.payment_sessions?.length) {
    return
  }

  return await txCartService.setPaymentSessions(
    cart as WithRequiredProperty<Cart, "total">
  )
}

export async function setVariantAvailability({ cart, container, manager }) {
  const productVariantInventoryService: ProductVariantInventoryService =
    container.resolve("productVariantInventoryService")

  const shouldSetAvailability =
    cart.items?.some((item) => !!item.variant) &&
    featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)

  if (!shouldSetAvailability) {
    return
  }

  return await productVariantInventoryService
    .withTransaction(manager)
    .setVariantAvailability(
      cart.items.map((i) => i.variant),
      cart.sales_channel_id!
    )
}
