import { IsolateSalesChannelDomainFeatureFlag } from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"

type HandlerInputData = {
  cart: {
    id: string
  }
  sales_channel: {
    sales_channel_id: string
  }
}

enum Aliases {
  Cart = "cart",
  SalesChannel = "sales_channel",
}

export async function detachCartFromSalesChannel({
  container,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const featureFlagRouter = container.resolve("featureFlagRouter")
  const remoteLink = container.resolve("remoteLink")

  if (
    !featureFlagRouter.isFeatureEnabled(
      IsolateSalesChannelDomainFeatureFlag.key
    )
  ) {
    return
  }

  const cart = data[Aliases.Cart]
  const salesChannel = data[Aliases.SalesChannel]

  await remoteLink.remove({
    salesChannelService: {
      id: salesChannel.sales_channel_id,
    },
    cartService: {
      id: cart.id,
    },
  })
}

detachCartFromSalesChannel.aliases = Aliases
