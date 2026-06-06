import type { ICartModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the line items to delete.
 */
export type DeleteLineItemsStepInput = string[]

export const deleteLineItemsStepId = "delete-line-items"
/**
 * This step deletes line items.
 */
export const deleteLineItemsStep = createStep(
  deleteLineItemsStepId,
  async (ids: DeleteLineItemsStepInput, { container }) => {
    const service = container.resolve<ICartModuleService>(Modules.CART)

    await service.softDeleteLineItems(ids)

    return new StepResponse(void 0, ids)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }
    const service = container.resolve<ICartModuleService>(Modules.CART)

    await service.restoreLineItems(ids)
  }
)
