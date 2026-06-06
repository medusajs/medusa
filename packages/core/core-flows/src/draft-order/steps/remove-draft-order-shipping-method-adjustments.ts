import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"
import type { IOrderModuleService } from "@zjedene-medusa/framework/types"

export const removeDraftOrderShippingMethodAdjustmentsStepId =
  "remove-draft-order-shipping-method-adjustments"

/**
 * The details of the shipping method adjustments to remove.
 */
export interface RemoveDraftOrderShippingMethodAdjustmentsStepInput {
  /**
   * The IDs of the shipping method adjustments to remove.
   */
  shippingMethodAdjustmentIdsToRemove: string[]
}

/**
 * This step removes shipping method adjustments from a draft order.
 *
 * @example
 * const data = removeDraftOrderShippingMethodAdjustmentsStep({
 *   shippingMethodAdjustmentIdsToRemove: ["adj_123", "adj_456"],
 * })
 */
export const removeDraftOrderShippingMethodAdjustmentsStep = createStep(
  removeDraftOrderShippingMethodAdjustmentsStepId,
  async function (
    data: RemoveDraftOrderShippingMethodAdjustmentsStepInput,
    { container }
  ) {
    const { shippingMethodAdjustmentIdsToRemove = [] } = data

    if (!shippingMethodAdjustmentIdsToRemove?.length) {
      return new StepResponse(void 0, [])
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteOrderShippingMethodAdjustments(
      shippingMethodAdjustmentIdsToRemove
    )

    return new StepResponse(void 0, shippingMethodAdjustmentIdsToRemove)
  },
  async function (shippingMethodAdjustmentIdsToRemove, { container }) {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (!shippingMethodAdjustmentIdsToRemove?.length) {
      return
    }

    await service.restoreOrderShippingMethodAdjustments(
      shippingMethodAdjustmentIdsToRemove
    )
  }
)
