import { Modules, PriceListWorkflowEvents } from "@medusajs/framework/utils"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, removeRemoteLinkStep } from "../../common"
import { deletePriceListsStep } from "../steps"

/**
 * The data to delete price lists.
 */
export type DeletePriceListsWorkflowInput = {
  /**
   * The IDs of the price lists to delete.
   */
  ids: string[]
}

export const deletePriceListsWorkflowId = "delete-price-lists"
/**
 * This workflow deletes one or more price lists. It's used by the
 * [Delete Price List Admin API Route](https://docs.medusajs.com/api/admin#price-lists_deletepricelistsid).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete price lists in your custom flows.
 *
 * @example
 * const { result } = await deletePriceListsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["plist_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more price lists.
 */
export const deletePriceListsWorkflow = createWorkflow(
  deletePriceListsWorkflowId,
  (input: WorkflowData<DeletePriceListsWorkflowInput>): WorkflowData<void> => {
    deletePriceListsStep(input.ids)

    const priceListIdEvents = transform({ input }, ({ input }) =>
      input.ids?.map((id) => ({ id }))
    )

    parallelize(
      removeRemoteLinkStep({
        [Modules.PRICING]: {
          price_list_id: input.ids,
        },
      }),
      emitEventStep({
        eventName: PriceListWorkflowEvents.DELETED,
        data: priceListIdEvents,
      })
    )
  }
)
