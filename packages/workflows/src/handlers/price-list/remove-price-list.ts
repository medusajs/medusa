import { IPricingModuleService, PriceListDTO } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { WorkflowArguments } from "../../helper"

export async function removePriceLists({
  container,
  data,
}: WorkflowArguments<{
  priceLists: {
    priceList: PriceListDTO
  }[]
}>): Promise<
  | {
      priceList: PriceListDTO
    }[]
  | void
> {
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

  if (!pricingService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Pricing service not found. You should install the @medusajs/pricing package to use pricing. The 'createPriceList' step will be skipped.`
    )
    return void 0
  }

  await pricingService!.deletePriceLists(
    data.priceLists.map(({ priceList }) => priceList.id)
  )

  return data.priceLists
}

removePriceLists.aliases = {
  priceLists: "priceLists",
}
