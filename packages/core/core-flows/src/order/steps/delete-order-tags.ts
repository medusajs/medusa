import type { IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The IDs of the order tags to delete.
 */
export type DeleteOrderTagsStepInput = string[]

export const deleteOrderTagsStepId = "delete-order-tags"
/**
 * This step deletes one or more order tags.
 *
 * `deleteOrderTags` is a hard delete - `IOrderModuleService` doesn't expose
 * a soft-delete/restore pair for order tags (Task 9 scoped the interface to
 * only the methods order-tags need), so this step has no compensation
 * function: a deleted tag cannot be restored.
 */
export const deleteOrderTagsStep = createStep(
  deleteOrderTagsStepId,
  async (ids: DeleteOrderTagsStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteOrderTags(ids)
    return new StepResponse(void 0, ids)
  }
)
