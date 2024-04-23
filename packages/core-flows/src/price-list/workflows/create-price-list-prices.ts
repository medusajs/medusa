import { CreatePriceListPricesWorkflowDTO } from "@medusajs/types"
import { PricingTypes } from "@medusajs/types/src"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import { createPriceListPricesStep } from "../steps/create-price-list-prices"
import { validatePriceListsStep } from "../steps/validate-price-lists"
import { validateVariantPriceLinksStep } from "../steps/validate-variant-price-links"

export const createPriceListPricesWorkflowId = "create-price-list-prices"
export const createPriceListPricesWorkflow = createWorkflow(
  createPriceListPricesWorkflowId,
  (
    input: WorkflowData<{
      data: CreatePriceListPricesWorkflowDTO[]
    }>
  ): WorkflowData<PricingTypes.PriceDTO[]> => {
    const [_, variantPriceMap] = parallelize(
      validatePriceListsStep(input.data),
      validateVariantPriceLinksStep(input.data)
    )

    return createPriceListPricesStep({
      data: input.data,
      variant_price_map: variantPriceMap,
    })
  }
)
