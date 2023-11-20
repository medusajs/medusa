import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"
import { prepareCreatePriceLists } from "./prepare-create-price-list"

type Result = {
  deleted: string[]
}

export async function removePriceListPriceSetPrices({
  container,
  data,
}: WorkflowArguments<{
  priceSets: string[]
  priceListId: string
}>): Promise<Result> {
  const { priceSets, priceListId } = data
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

  const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts(
    {
      price_set_id: priceSets,
      price_list_id: [priceListId],
    },
    {
      relations: ["money_amount"],
    }
  )

  const moneyAmountIDs = priceSetMoneyAmounts
    .map((priceSetMoneyAmount) => priceSetMoneyAmount.money_amount?.id)
    .filter((moneyAmountId): moneyAmountId is string => !!moneyAmountId)

  await pricingService.deleteMoneyAmounts(moneyAmountIDs)

  return {
    deleted: moneyAmountIDs,
  }
}

prepareCreatePriceLists.aliases = {
  payload: "payload",
}
