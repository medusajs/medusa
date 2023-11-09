import { WorkflowArguments } from "../../helper"
import { IPricingModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

type Result = {
  moneyAmountIds: string[]
  priceListId: string
}

export async function prepareRemovePriceListPrices({
  container,
  data,
}: WorkflowArguments<{
  moneyAmountIds: string[]
  priceListId: string
}>): Promise<Result | void> {
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

  const { priceListId, moneyAmountIds: moneyAmountIdsToDelete } = data

  const moneyAmounts = await pricingService.listMoneyAmounts(
    { id: moneyAmountIdsToDelete },
    {
      relations: [
        "price_set_money_amount",
        "price_set_money_amount.price_list",
      ],
    }
  )

  const moneyAmountIds = moneyAmounts
    .filter(
      (moneyAmount) =>
        !!moneyAmount.price_set_money_amount?.price_list &&
        moneyAmount.price_set_money_amount!.price_list.id === priceListId
    )
    .map((ma) => ma.id)

  return { moneyAmountIds, priceListId }
}

prepareRemovePriceListPrices.aliases = {
  payload: "payload",
}
