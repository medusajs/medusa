import { MedusaError } from "@medusajs/utils"
import { isDefined } from "medusa-core-utils"

import { WorkflowArguments } from "@medusajs/workflows-sdk"

type AttachSalesChannelDTO = {
  sales_channel_id?: string
}

type HandlerInputData = {
  sales_channel: {
    sales_channel_id?: string
    publishableApiKeyScopes?: {
      sales_channel_ids?: string[]
    }
  }
}

enum Aliases {
  SalesChannel = "sales_channel",
}

export async function findSalesChannel({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<AttachSalesChannelDTO> {
  const { manager } = context
  const salesChannelService = container.resolve("salesChannelService")
  const salesChannelServiceTx = salesChannelService.withTransaction(manager)
  const storeService = container.resolve("storeService")
  const storeServiceTx = storeService.withTransaction(manager)

  let salesChannelId = data[Aliases.SalesChannel].sales_channel_id
  let salesChannel
  
  const publishableApiKeyScopes =
    data[Aliases.SalesChannel].publishableApiKeyScopes || {}

  delete data[Aliases.SalesChannel].publishableApiKeyScopes

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
    salesChannel = await salesChannelServiceTx.retrieve(salesChannelId)
  } else {
    salesChannel = (
      await storeServiceTx.retrieve({
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

  return { sales_channel_id: salesChannel?.id}
}

findSalesChannel.aliases = Aliases
