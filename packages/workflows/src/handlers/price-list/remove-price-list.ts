import { IPricingModuleService, PriceListDTO } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { WorkflowArguments } from "../../helper"

export async function removePriceLists({
  container,
  data,
}: WorkflowArguments<{
  price_lists: {
    price_list: PriceListDTO
  }[]
}>): Promise<
  | {
      price_list: PriceListDTO
    }[]
  | void
> {
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

  if (!pricingService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Pricing service not found. You should install the @medusajs/pricing package to use pricing. The 'removePriceLists' step will be skipped.`
    )
    return
  }

  await pricingService!.deletePriceLists(
    data.price_lists.map(({ price_list }) => price_list.id)
  )

  return data.price_lists
}

removePriceLists.aliases = {
  priceLists: "priceLists",
}
