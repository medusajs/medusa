import { PriceListWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useQueryGraphStep } from "../../common"
import { removePriceListPricesStep } from "../steps/remove-price-list-prices"

/**
 * The data to remove prices.
 */
export type RemovePriceListPricesWorkflowInput = {
  /**
   * The IDs of the prices to remove.
   */
  ids: string[]
}

export const removePriceListPricesWorkflowId = "remove-price-list-prices"
/**
 * This workflow removes prices. It's used by other workflows, such
 * as {@link batchPriceListPricesWorkflow}.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * remove prices in your custom flows.
 *
 * @example
 * const { result } = await removePriceListPricesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["price_123"]
 *   }
 * })
 *
 * @summary
 *
 * Remove prices.
 */
export const removePriceListPricesWorkflow = createWorkflow(
  removePriceListPricesWorkflowId,
  (
    input: WorkflowData<RemovePriceListPricesWorkflowInput>
  ): WorkflowResponse<string[]> => {
    const { data: prices } = useQueryGraphStep({
      entity: "price",
      fields: ["id", "price_list_id", "price_set_id"],
      filters: { id: input.ids },
    }).config({ name: "get-price-list-prices-to-remove" })

    const removedPriceIds = removePriceListPricesStep(input.ids)

    const eventData = transform({ prices }, ({ prices }) => {
      const priceSetIdsByPriceList = new Map<string, Set<string>>()

      for (const price of prices) {
        if (!price.price_list_id || !price.price_set_id) {
          continue
        }

        const priceSetIds =
          priceSetIdsByPriceList.get(price.price_list_id) ?? new Set<string>()
        priceSetIds.add(price.price_set_id)
        priceSetIdsByPriceList.set(price.price_list_id, priceSetIds)
      }

      return [...priceSetIdsByPriceList].map(([id, priceSetIds]) => ({
        id,
        price_set_ids: [...priceSetIds],
      }))
    })

    emitEventStep({
      eventName: PriceListWorkflowEvents.PRICES_REMOVED,
      data: eventData,
    })

    return new WorkflowResponse(removedPriceIds)
  }
)
