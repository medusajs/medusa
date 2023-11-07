import {
  AddPriceListPricesDTO,
  IPricingModuleService,
  PriceListDTO,
  PriceListPriceDTO,
  UpdatePriceListDTO,
} from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { WorkflowArguments } from "../../helper"

type Result = {
  priceLists: PriceListDTO[]
}

export async function updatePriceLists({
  container,
  data,
}: WorkflowArguments<{
  priceLists: UpdatePriceListDTO[]
  priceListPricesMap: Map<string, PriceListPriceDTO[]>
}>): Promise<Result> {
  const { priceLists: priceListsData, priceListPricesMap } = data
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

  const priceLists = await pricingService.updatePriceLists(priceListsData)
  const addPriceListPricesData: AddPriceListPricesDTO[] = []

  for (const [priceListId, prices] of priceListPricesMap.entries()) {
    addPriceListPricesData.push({
      priceListId,
      prices,
    })
  }

  await pricingService.addPriceListPrices(addPriceListPricesData)

  return { priceLists }
}

updatePriceLists.aliases = {
  payload: "updatePriceLists",
}
