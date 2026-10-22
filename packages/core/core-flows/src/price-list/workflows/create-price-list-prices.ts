import {
  CreatePriceListPricesWorkflowDTO,
  PricingTypes,
} from "@medusajs/framework/types"
import { PriceListWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { createPriceListPricesStep } from "../steps/create-price-list-prices"
import { validatePriceListsStep } from "../steps/validate-price-lists"
import { validateVariantPriceLinksStep } from "../steps/validate-variant-price-links"

/**
 * The data to create prices for price lists.
 */
export type CreatePriceListPricesWorkflowInput = {
  /**
   * The prices to create.
   */
  data: CreatePriceListPricesWorkflowDTO[]
}

/**
 * The created prices.
 */
export type CreatePriceListPricesWorkflowOutput = PricingTypes.PriceDTO[]

export const createPriceListPricesWorkflowId = "create-price-list-prices"
/**
 * This workflow creates prices in price lists. It's used by other workflows, such as 
 * {@link batchPriceListPricesWorkflow}.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create prices in price lists in your custom flows.
 * 
 * @example
 * const { result } = await createPriceListPricesWorkflow(container)
 * .run({
 *   input: {
 *     data: [{
 *       id: "plist_123",
 *       prices: [
 *         {
 *           amount: 10,
 *           currency_code: "usd",
 *           variant_id: "variant_123"
 *         }
 *       ],
 *     }]
 *   }
 * })
 * 
 * @summary
 * 
 * Create prices in price lists.
 */
export const createPriceListPricesWorkflow = createWorkflow(
  createPriceListPricesWorkflowId,
  (
    input: WorkflowData<CreatePriceListPricesWorkflowInput>
  ): WorkflowResponse<CreatePriceListPricesWorkflowOutput> => {
    const [_, variantPriceMap] = parallelize(
      validatePriceListsStep(input.data),
      validateVariantPriceLinksStep(input.data)
    )

    const prices = createPriceListPricesStep({
      data: input.data,
      variant_price_map: variantPriceMap,
    })

    const eventData = transform(
      { input, variantPriceMap },
      ({ input, variantPriceMap = {} }) =>
        input.data
          .filter((priceList) => priceList.prices?.length)
          .map((priceList) => ({
            id: priceList.id,
            price_set_ids: [
              ...new Set(
                priceList.prices.map(
                  (price) => variantPriceMap[price.variant_id]
                )
              ),
            ],
          }))
    )

    emitEventStep({
      eventName: PriceListWorkflowEvents.PRICES_ADDED,
      data: eventData,
    })

    return new WorkflowResponse(prices)
  }
)
