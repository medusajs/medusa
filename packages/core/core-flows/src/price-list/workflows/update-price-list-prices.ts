import {
  PricingTypes,
  UpdatePriceListPricesWorkflowDTO,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
} from "@zjedene-medusa/framework/workflows-sdk"
import { updatePriceListPricesStep } from "../steps/update-price-list-prices"
import { validatePriceListsStep } from "../steps/validate-price-lists"
import { validateVariantPriceLinksStep } from "../steps/validate-variant-price-links"

/**
 * The data to update the prices of price lists.
 */
export type UpdatePriceListPricesWorkflowInput = {
  /**
   * The price lists to update their prices.
   */
  data: UpdatePriceListPricesWorkflowDTO[]
}

export const updatePriceListPricesWorkflowId = "update-price-list-prices"
/**
 * This workflow update price lists' prices. It's used by other workflows, such
 * as {@link batchPriceListPricesWorkflow}.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * update prices in price lists in your custom flows.
 * 
 * @example
 * const { result } = await updatePriceListPricesWorkflow(container)
 * .run({
 *   input: {
 *     data: [
 *       {
 *         id: "price_123",
 *         prices: [
 *           {
 *             id: "price_123",
 *             amount: 10,
 *             currency_code: "usd",
 *             variant_id: "variant_123"
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * })
 * 
 * @summary
 * 
 * Update price lists' prices.
 */
export const updatePriceListPricesWorkflow = createWorkflow(
  updatePriceListPricesWorkflowId,
  (
    input: WorkflowData<UpdatePriceListPricesWorkflowInput>
  ): WorkflowResponse<PricingTypes.PriceDTO[]> => {
    const [_, variantPriceMap] = parallelize(
      validatePriceListsStep(input.data),
      validateVariantPriceLinksStep(input.data)
    )

    return new WorkflowResponse(
      updatePriceListPricesStep({
        data: input.data,
        variant_price_map: variantPriceMap,
      })
    )
  }
)
