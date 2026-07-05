import type { UpdatePriceListWorkflowInputDTO } from "@medusajs/framework/types"
import { PriceListWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { updatePriceListsStep, validatePriceListsStep } from "../steps"

/**
 * The data to update price lists.
 */
export type UpdatePriceListsWorkflowInput = {
  /**
   * The price lists to update.
   */
  price_lists_data: UpdatePriceListWorkflowInputDTO[]
}

export const updatePriceListsWorkflowId = "update-price-lists"
/**
 * This workflow updates one or more price lists. It's used by the
 * [Update Price List Admin API Route](https://docs.medusajs.com/api/admin#price-lists_postpricelistsid).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * update price lists in your custom flows.
 *
 * @example
 * const { result } = await updatePriceListsWorkflow(container)
 * .run({
 *   input: {
 *     price_lists_data: [
 *       {
 *         id: "plist_123",
 *         title: "Test Price List",
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Update one or more price lists.
 */
export const updatePriceListsWorkflow = createWorkflow(
  updatePriceListsWorkflowId,
  (
    input: WorkflowData<{ price_lists_data: UpdatePriceListWorkflowInputDTO[] }>
  ) => {
    validatePriceListsStep(input.price_lists_data)

    const updatedPriceLists = updatePriceListsStep(input.price_lists_data)

    const priceListIdEvents = transform(
      { updatedPriceLists },
      ({ updatedPriceLists }) => {
        const arr = Array.isArray(updatedPriceLists)
          ? updatedPriceLists
          : [updatedPriceLists]

        return arr?.map((pl) => ({ id: pl.id }))
      }
    )

    emitEventStep({
      eventName: PriceListWorkflowEvents.UPDATED,
      data: priceListIdEvents,
    })

    return new WorkflowResponse(updatedPriceLists)
  }
)
