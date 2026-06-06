import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"
import type { IOrderModuleService } from "@zjedene-medusa/framework/types"
export const removeDraftOrderLineItemAdjustmentsStepId =
  "remove-draft-order-line-item-adjustments"

/**
 * The details of the line item adjustments to remove.
 */
export interface RemoveDraftOrderLineItemAdjustmentsStepInput {
  /**
   * The IDs of the line item adjustments to remove.
   */
  lineItemAdjustmentIdsToRemove: string[]
}

/**
 * This step removes line item adjustments from a draft order.
 *
 * @example
 * const data = removeDraftOrderLineItemAdjustmentsStep({
 *   lineItemAdjustmentIdsToRemove: ["adj_123", "adj_456"],
 * })
 */
export const removeDraftOrderLineItemAdjustmentsStep = createStep(
  removeDraftOrderLineItemAdjustmentsStepId,
  async function (
    data: RemoveDraftOrderLineItemAdjustmentsStepInput,
    { container }
  ) {
    const { lineItemAdjustmentIdsToRemove = [] } = data

    if (!lineItemAdjustmentIdsToRemove?.length) {
      return new StepResponse(void 0, [])
    }

    const draftOrderModuleService = container.resolve<IOrderModuleService>(
      Modules.ORDER
    )

    await draftOrderModuleService.deleteOrderLineItemAdjustments(
      lineItemAdjustmentIdsToRemove
    )

    return new StepResponse(void 0, lineItemAdjustmentIdsToRemove)
  },
  async function (lineItemAdjustmentIdsToRemove, { container }) {
    const draftOrderModuleService = container.resolve<IOrderModuleService>(
      Modules.ORDER
    )

    if (!lineItemAdjustmentIdsToRemove?.length) {
      return
    }

    await draftOrderModuleService.restoreOrderLineItemAdjustments(
      lineItemAdjustmentIdsToRemove
    )
  }
)
