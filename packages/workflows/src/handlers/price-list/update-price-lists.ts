import {
  AddPriceListPricesDTO,
  IPricingModuleService,
  PriceListDTO,
  PriceListPriceDTO,
  UpdateMoneyAmountDTO,
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
  const updateMoneyAmounts: UpdateMoneyAmountDTO[] = []

  for (const [priceListId, prices] of priceListPricesMap.entries()) {
    for (const price of prices) {
      if (price.id) {
        addPriceListPricesData.push({
          priceListId,
          prices: prices.filter((price) => !price.id),
        })

        continue
      }

      updateMoneyAmounts.push(price as UpdateMoneyAmountDTO)
    }
  }

  if (addPriceListPricesData.length) {
    await pricingService.addPriceListPrices(addPriceListPricesData)
  }

  if (updateMoneyAmounts.length) {
    await pricingService.updateMoneyAmounts(updateMoneyAmounts)
  }

  return { priceLists }
}

updatePriceLists.aliases = {
  payload: "updatePriceLists",
}
