import { isDefined } from "medusa-core-utils"
import { MedusaError } from "@medusajs/utils"

import { WorkflowArguments } from "../../helper"

type AttachSalesChannelDTO = {
  sales_channel_id?: string
}

enum Aliases {
  Cart = "cart",
}

export async function attachSalesChannelToCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<AttachSalesChannelDTO> {
  let salesChannel
  let salesChannelId = data[Aliases.Cart].sales_channel_id
  const salesChannelDTO: AttachSalesChannelDTO = {}
  const salesChannelService = container.resolve("salesChannelService")
  const storeService = container.resolve("storeService")
  const publishableApiKeyScopes = data[Aliases.Cart].publishableApiKeyScopes || {}

  delete data[Aliases.Cart].publishableApiKeyScopes

  if (
    !isDefined(salesChannelId) &&
    publishableApiKeyScopes?.sales_channel_ids?.length
  ) {
    if (publishableApiKeyScopes.sales_channel_ids.length > 1) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "The provided PublishableApiKey has multiple associated sales channels."
      )
    }

    salesChannelId = publishableApiKeyScopes.sales_channel_ids[0]
  }

  if (isDefined(salesChannelId)) {
    salesChannel = await salesChannelService
      .retrieve(salesChannelId)
  } else {
    salesChannel = (
      await storeService.retrieve({
        relations: ["default_sales_channel"],
      })
    ).default_sales_channel
  }

  if (salesChannel.is_disabled) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Unable to assign the cart to a disabled Sales Channel "${salesChannel.name}"`
    )
  }

  salesChannelDTO.sales_channel_id = salesChannel?.id

  return salesChannelDTO
}

attachSalesChannelToCart.aliases = Aliases
