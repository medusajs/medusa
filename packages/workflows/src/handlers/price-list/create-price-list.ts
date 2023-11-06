import {
  CreatePriceListDTO,
  IPricingModuleService,
  PriceListDTO,
} from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { WorkflowArguments } from "../../helper"

type Result = {
  priceList: PriceListDTO
}[]

type Input = {
  tag?: string
  priceList: CreatePriceListDTO
}[]

export async function createPriceLists({
  container,
  data,
}: WorkflowArguments<{
  priceLists: Input
}>): Promise<Result | void> {
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

  return await Promise.all(
    data.priceLists.map(async (item) => {
      const [priceList] = await pricingService!.createPriceLists([
        item.priceList,
      ])

      return { tag: item.tag ?? priceList.id, priceList }
    })
  )
}

createPriceLists.aliases = {
  priceLists: "priceLists",
}
