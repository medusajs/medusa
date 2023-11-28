import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"
import { prepareCreatePriceLists } from "./prepare-create-price-list"

export async function removePriceListPriceSetPrices({
  container,
  data,
}: WorkflowArguments<{
  priceSetIds: string[]
  priceListId: string
}>): Promise<string[]> {
  const { priceSetIds, priceListId } = data
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

  const priceSetMoneyAmounts = await pricingService.listPriceSetMoneyAmounts(
    {
      price_set_id: priceSetIds,
      price_list_id: [priceListId],
    },
    {
      relations: ["money_amount"],
      take: null,
    }
  )

  const moneyAmountIDs = priceSetMoneyAmounts
    .map((priceSetMoneyAmount) => priceSetMoneyAmount.money_amount?.id)
    .filter((moneyAmountId): moneyAmountId is string => !!moneyAmountId)

  await pricingService.deleteMoneyAmounts(moneyAmountIDs)

  return moneyAmountIDs
}

prepareCreatePriceLists.aliases = {
  payload: "payload",
}
