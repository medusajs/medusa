import { WorkflowArguments } from "../../helper"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"

type Result = {
  deleted: string[]
}

export async function removePrices({
  container,
  data,
}: WorkflowArguments<{
  moneyAmountIds: string[]
}>): Promise<Result | void> {
  const { moneyAmountIds } = data
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

  await pricingService.deleteMoneyAmounts(moneyAmountIds)

  return {
    deleted: moneyAmountIds,
  }
}

removePrices.aliases = {
  payload: "payload",
}
