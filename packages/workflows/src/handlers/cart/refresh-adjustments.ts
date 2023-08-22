import { CartWorkflow } from "@medusajs/types"
import { SalesChannelFeatureFlag } from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"

type HandlerInputData = {
  line_items?: CartWorkflow.CreateLineItemInputDTO[]
  cart: {
    id: string
    customer_id: string
    region_id: string
  }
}

enum Aliases {
  Cart = "cart",
}

export async function refreshAdjustments({
  container,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const cartService = container.resolve("cartService")

  const cartId = data[Aliases.Cart].id

  const cart = await cartService.retrieve(cartId, {
    relations: [
      "items.variant.product.profiles",
      "discounts",
      "discounts.rule",
      "region",
    ],
    select: [
      "id", 
      "sales_channel_id"
    ]
  })

  await cartService.refreshAdjustments(cart)
}

refreshAdjustments.aliases = Aliases
