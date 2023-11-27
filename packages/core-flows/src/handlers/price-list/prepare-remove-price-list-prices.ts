import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type Result = {
  moneyAmountIds: string[]
  priceListId: string
}

export async function prepareRemovePriceListPrices({
  container,
  data,
}: WorkflowArguments<{
  money_amount_ids: string[]
  price_list_id: string
}>): Promise<Result | void> {
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

  const {
    price_list_id: priceListId,
    money_amount_ids: moneyAmountIdsToDelete,
  } = data

  const moneyAmounts = await pricingService.listMoneyAmounts(
    { id: moneyAmountIdsToDelete },
    {
      relations: [
        "price_set_money_amount",
        "price_set_money_amount.price_list",
      ],
      take: null,
    }
  )

  const moneyAmountIds = moneyAmounts
    .filter(
      (moneyAmount) =>
        moneyAmount?.price_set_money_amount?.price_list?.id === priceListId
    )
    .map((ma) => ma.id)

  return { moneyAmountIds, priceListId }
}

prepareRemovePriceListPrices.aliases = {
  payload: "payload",
}
