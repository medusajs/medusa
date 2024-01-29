import { MedusaV2Flag } from "@medusajs/utils"
import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { Modules } from "@medusajs/modules-sdk"

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

  if (!featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
    return
  }

  const cart = data[Aliases.Cart]
  const salesChannel = data[Aliases.SalesChannel]

  await remoteLink.dismiss({
    [Modules.CART]: {
      cart_id: cart.id,
    },
    [Modules.SALES_CHANNEL]: {
      sales_channel_id: salesChannel.sales_channel_id,
    },
  })
}

detachCartFromSalesChannel.aliases = Aliases
