import {
  CreateLineItemAdjustmentDTO,
  ICartModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the line item adjustments to create.
 */
export interface CreateLineItemAdjustmentsCartStepInput {
  /**
   * The line item adjustments to create.
   */
  lineItemAdjustmentsToCreate: CreateLineItemAdjustmentDTO[]
}

export const createLineItemAdjustmentsStepId = "create-line-item-adjustments"
/**
 * This step creates line item adjustments in a cart, such as when a promotion is applied.
 *
 * @example
 * createLineItemAdjustmentsStep({
 *   lineItemAdjustmentsToCreate: [
 *     {
 *       item_id: "litem_123",
 *       code: "10OFF",
 *       amount: 10,
 *     }
 *   ]
 * })
 */
export const createLineItemAdjustmentsStep = createStep(
  createLineItemAdjustmentsStepId,
  async (data: CreateLineItemAdjustmentsCartStepInput, { container }) => {
    const { lineItemAdjustmentsToCreate = [] } = data

    if (!lineItemAdjustmentsToCreate?.length) {
      return new StepResponse([], [])
    }

    const cartModuleService: ICartModuleService = container.resolve(
      Modules.CART
    )

    const createdLineItemAdjustments =
      await cartModuleService.addLineItemAdjustments(
        lineItemAdjustmentsToCreate
      )

    return new StepResponse(void 0, createdLineItemAdjustments)
  },
  async (createdLineItemAdjustments, { container }) => {
    const cartModuleService: ICartModuleService = container.resolve(
      Modules.CART
    )

    if (!createdLineItemAdjustments?.length) {
      return
    }

    await cartModuleService.softDeleteLineItemAdjustments(
      createdLineItemAdjustments.map((c) => c.id)
    )
  }
)
