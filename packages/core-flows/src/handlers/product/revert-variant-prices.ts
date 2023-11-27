import { PricingTypes } from "@medusajs/types"
import { MedusaV2Flag } from "@medusajs/utils"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type HandlerInput = {
  createdLinks: Record<any, any>[]
  originalMoneyAmounts: PricingTypes.MoneyAmountDTO[]
  createdPriceSets: PricingTypes.PriceSetDTO[]
}

export async function revertVariantPrices({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<void> {
  const {
    createdLinks = [],
    originalMoneyAmounts = [],
    createdPriceSets = [],
  } = data

  const featureFlagRouter = container.resolve("featureFlagRouter")
  const isPricingDomainEnabled = featureFlagRouter.isFeatureEnabled(
    MedusaV2Flag.key
  )

  if (!isPricingDomainEnabled) {
    return
  }

  const pricingModuleService = container.resolve("pricingModuleService")
  const remoteLink = container.resolve("remoteLink")

  await remoteLink.remove(createdLinks)

  if (originalMoneyAmounts.length) {
    await pricingModuleService.updateMoneyAmounts(originalMoneyAmounts)
  }

  if (createdPriceSets.length) {
    await pricingModuleService.delete({
      id: createdPriceSets.map((cps) => cps.id),
    })
  }
}

revertVariantPrices.aliases = {
  productVariantsPrices: "productVariantsPrices",
}
