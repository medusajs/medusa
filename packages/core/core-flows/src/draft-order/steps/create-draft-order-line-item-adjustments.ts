import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import {
  CreateLineItemAdjustmentDTO,
  IOrderModuleService,
} from "@medusajs/framework/types"

export const createDraftOrderLineItemAdjustmentsStepId =
  "create-draft-order-line-item-adjustments"

/**
 * The details of the line item adjustments to create.
 */
export interface CreateDraftOrderLineItemAdjustmentsStepInput {
  /**
   * The ID of the draft order to create the line item adjustments for.
   */
  order_id: string
  /**
   * The line item adjustments to create.
   */
  lineItemAdjustmentsToCreate: CreateLineItemAdjustmentDTO[]
  /**
   * The version of the order change to create the line item adjustments for.
   */
  version?: number
}

/**
 * This step creates line item adjustments for a draft order.
 *
 * @example
 * const data = createDraftOrderLineItemAdjustmentsStep({
 *   order_id: "order_123",
 *   lineItemAdjustmentsToCreate: [
 *     {
 *       item_id: "orli_123",
 *       code: "PROMO_123",
 *       amount: 10,
 *     }
 *   ]
 * })
 */
export const createDraftOrderLineItemAdjustmentsStep = createStep(
  createDraftOrderLineItemAdjustmentsStepId,
  async function (
    data: CreateDraftOrderLineItemAdjustmentsStepInput,
    { container }
  ) {
    const { lineItemAdjustmentsToCreate = [], order_id, version } = data

    if (!lineItemAdjustmentsToCreate?.length) {
      return new StepResponse(void 0, [])
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    /**
     * If an items quantity has been changed to 0, it will result in an undefined amount.
     * In this case, we don't want to create an adjustment, as the item will be removed,
     * and trying to create an adjustment will throw an error.
     */
    const filteredAdjustments = lineItemAdjustmentsToCreate.filter(
      (adjustment) => {
        return !!adjustment.amount
      }
    )

    const lineItemAdjustments = await service.createOrderLineItemAdjustments(
      filteredAdjustments.map((adjustment) => ({
        ...adjustment,
        version,
        order_id,
      }))
    )

    const createdLineItemAdjustments = lineItemAdjustments.map(
      (adjustment) => adjustment.id
    )

    return new StepResponse(
      createdLineItemAdjustments,
      createdLineItemAdjustments
    )
  },
  async function (createdLineItemAdjustments, { container }) {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (!createdLineItemAdjustments?.length) {
      return
    }

    await service.deleteOrderLineItemAdjustments(createdLineItemAdjustments)
  }
)
