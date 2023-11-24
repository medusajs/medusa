import {
  AddPriceListPricesDTO,
  IPricingModuleService,
  PriceListDTO,
  PriceListPriceDTO,
  UpdateMoneyAmountDTO,
  UpdatePriceListDTO,
} from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

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
  const moneyAmountsToUpdate: UpdateMoneyAmountDTO[] = []

  for (const [priceListId, prices] of priceListPricesMap.entries()) {
    const moneyAmountsToCreate: PriceListPriceDTO[] = []

    for (const price of prices) {
      if (price.id) {
        moneyAmountsToUpdate.push(price as UpdateMoneyAmountDTO)
      } else {
        moneyAmountsToCreate.push(price)
      }
    }

    addPriceListPricesData.push({
      priceListId,
      prices: moneyAmountsToCreate,
    })
  }

  if (addPriceListPricesData.length) {
    await pricingService.addPriceListPrices(addPriceListPricesData)
  }

  if (moneyAmountsToUpdate.length) {
    await pricingService.updateMoneyAmounts(moneyAmountsToUpdate)
  }

  return { priceLists }
}

updatePriceLists.aliases = {
  payload: "updatePriceLists",
}
