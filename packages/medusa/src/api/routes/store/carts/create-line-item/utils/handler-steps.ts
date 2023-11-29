import {
  FlagRouter,
  MedusaV2Flag,
  prepareLineItemData,
  validateItemsInput,
} from "@medusajs/utils"
import { AwilixContainer } from "awilix"
import { EntityManager } from "typeorm"

import { Cart } from "../../../../../../models"
import {
  CartService,
  LineItemService,
  ProductVariantInventoryService,
} from "../../../../../../services"
import { WithRequiredProperty } from "../../../../../../types/common"
import { IdempotencyCallbackResult } from "../../../../../../types/idempotency-key"
import { defaultStoreCartFields, defaultStoreCartRelations } from "../../index"
import SalesChannelFeatureFlag from "../../../../../../loaders/feature-flags/sales-channels"
import { retrieveVariantsWithIsolatedProductModule } from "../../../../../../utils"

export const CreateLineItemSteps = {
  STARTED: "started",
  FINISHED: "finished",
}

export async function handleAddOrUpdateLineItem(
  cartId: string,
  data: {
    metadata?: Record<string, unknown>
    customer_id?: string
    variant_id: string
    quantity: number
  },
  { container, manager }: { container: AwilixContainer; manager: EntityManager }
): Promise<IdempotencyCallbackResult> {
  const cartService: CartService = container.resolve("cartService")
  const lineItemService: LineItemService = container.resolve("lineItemService")

  const featureFlagRouter: FlagRouter = container.resolve("featureFlagRouter")

  const productVariantInventoryService: ProductVariantInventoryService =
    container.resolve("productVariantInventoryService")

  const txCartService = cartService.withTransaction(manager)

  let cart = await txCartService.retrieve(cartId, {
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

  await txCartService.addOrUpdateLineItems(cart.id, line, {
    validateSalesChannels: featureFlagRouter.isFeatureEnabled("sales_channels"),
  })

  const relations = [
    ...defaultStoreCartRelations,
    "billing_address",
    "region.payment_providers",
    "payment_sessions",
    "customer",
  ]

  const shouldSetAvailability =
    relations?.some((rel) => rel.includes("variant")) &&
    featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)

  cart = await txCartService.retrieveWithTotals(cart.id, {
    select: defaultStoreCartFields,
    relations,
  })

  if (shouldSetAvailability) {
    await productVariantInventoryService.setVariantAvailability(
      cart.items.map((i) => i.variant),
      cart.sales_channel_id!
    )
  }

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
