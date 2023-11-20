import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type Result = {
  deleted: string[]
}

export async function removePrices({
  container,
  data,
}: WorkflowArguments<{
  moneyAmountIds: string[]
}>): Promise<Result> {
  const { moneyAmountIds } = data
  const pricingService: IPricingModuleService = container.resolve(
    ModuleRegistrationName.PRICING
  )

  await pricingService.deleteMoneyAmounts(moneyAmountIds)

  return {
    deleted: moneyAmountIds,
  }
}

removePrices.aliases = {
  payload: "payload",
}
