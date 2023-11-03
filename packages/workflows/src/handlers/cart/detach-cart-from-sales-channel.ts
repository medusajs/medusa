import { IsolatePricingDomainFeatureFlag } from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"

type HandlerInputData = {
  sales_channel: {
    id: string
  }
  cart: {
    id: string
  }
}

enum Aliases {
  SalesChannel = "SalesChannel",
  Cart = "cart",
}

export async function detachCartFromSalesChannel({
  container,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const salesChannelService = container.resolve("salesChannelService")
  const featureFlagRouter = container.resolve("featureFlagRouter")
  if (
    !featureFlagRouter.isFeatureEnabled(IsolatePricingDomainFeatureFlag.key)
  ) {
    return
  }

  const cart = data[Aliases.Cart]
  const salesChannel = data[Aliases.SalesChannel]

  await salesChannelService.removeCarts(salesChannel.id, [cart.id])
}

detachCartFromSalesChannel.aliases = Aliases
