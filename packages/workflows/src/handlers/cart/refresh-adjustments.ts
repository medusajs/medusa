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
  LineItems = "line_items",
  Cart = "cart",
}

export async function refreshAdjustments({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const { manager } = context

  const cartService = container.resolve("cartService")

  const cartServiceTx = cartService.withTransaction(manager)
  const cart = data[Aliases.Cart]

  await cartServiceTx.createLineItemsForNewCart(cart.id)
}

refreshAdjustments.aliases = Aliases
