import { WorkflowArguments } from "../../helper"
import { prepareCreatePriceLists } from "./prepare-create-price-list"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"

type Result = {
  deleted: string[]
}

export async function removePriceListPriceSetPrices({
  container,
  data,
}: WorkflowArguments<{
  priceSets: string[]
  priceListId: string
}>): Promise<Result | void> {
  const { priceSets, priceListId } = data
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

type QueryResult = {
  id: string
  variants: {
    id: string
    price: {
      price_set_id: string
      variant_id: string
    }
  }[]
}

const defaultAdminProductRemoteQueryObject = {
  fields: ["id"],
  variants: {
    price: {
      fields: ["variant_id", "price_set_id"],
    },
  },
}
