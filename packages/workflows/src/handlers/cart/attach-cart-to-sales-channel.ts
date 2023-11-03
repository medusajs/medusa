import { IsolatePricingDomainFeatureFlag, MedusaError } from "@medusajs/utils"

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

export async function attachCartToSalesChannel({
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

  if (salesChannel.is_disabled) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Unable to assign the cart to a disabled Sales Channel "${salesChannel.name}"`
    )
  }

  await salesChannelService.addCarts(salesChannel.id, [cart.id])
}

attachCartToSalesChannel.aliases = Aliases
