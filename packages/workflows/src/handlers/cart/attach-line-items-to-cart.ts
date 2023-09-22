import { LineItemDTO } from "@medusajs/types"
import { SalesChannelFeatureFlag } from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"

type HandlerInputData = {
  line_items: LineItemDTO[]
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

export async function attachLineItemsToCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const { manager } = context

  const featureFlagRouter = container.resolve("featureFlagRouter")
  const cartService = container.resolve("cartService")

  const cartServiceTx = cartService.withTransaction(manager)
  let lineItems = data[Aliases.LineItems]
  const cart = data[Aliases.Cart]

  if (lineItems?.length) {
    await cartServiceTx.addOrUpdateLineItems(cart.id, lineItems, {
      validateSalesChannels: featureFlagRouter.isFeatureEnabled(
        SalesChannelFeatureFlag.key
      ),
    })
  }
}

attachLineItemsToCart.aliases = Aliases
