import {
  CreatePriceListDTO,
  IPricingModuleService,
  PriceListDTO,
} from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

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
}>): Promise<Result> {
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

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
