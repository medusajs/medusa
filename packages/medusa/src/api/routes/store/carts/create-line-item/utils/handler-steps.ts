import { Cart } from "../../../../../../models"
import {
  FlagRouter,
  MedusaV2Flag,
  prepareLineItemData,
  validateItemsInput,
} from "@medusajs/utils"

import {
  CartService,
  LineItemService,
  ProductVariantInventoryService,
} from "../../../../../../services"
import { WithRequiredProperty } from "../../../../../../types/common"
import SalesChannelFeatureFlag from "../../../../../../loaders/feature-flags/sales-channels"
import { featureFlagRouter } from "../../../../../../loaders/feature-flags"
import { retrieveVariantsWithIsolatedProductModule } from "../../../../../../utils"

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

  const featureFlagRouter: FlagRouter = container.resolve("featureFlagRouter")

  const productVariantInventoryService: ProductVariantInventoryService =
    container.resolve("productVariantInventoryService")

  const cart = await cartService.retrieve(cartId, {
    select: ["id", "region_id", "customer_id"],
  })

  let line

  if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
    const remoteQuery = container.resolve("remoteQuery")
    const [variant] = await retrieveVariantsWithIsolatedProductModule(
      remoteQuery,
      [data.variant_id]
    )

    validateItemsInput([data], [variant])

    line = await lineItemService
      .withTransaction(manager)
      .generateLineItem(prepareLineItemData(variant, data.quantity), {
        customer_id: data.customer_id || cart.customer_id,
        metadata: data.metadata,
        region_id: cart.region_id,
      })

    line.variant = variant
  } else {
    line = await lineItemService
      .withTransaction(manager)
      .generate(data.variant_id, cart.region_id, data.quantity, {
        customer_id: data.customer_id || cart.customer_id,
        metadata: data.metadata,
      })
  }

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
