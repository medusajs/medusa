import type {
  FilterableOrderTagProps,
  IOrderModuleService,
  UpdateOrderTagDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to identify and update the order tags.
 */
export type UpdateOrderTagsStepInput = {
  /**
   * The filters to select the order tags to update.
   */
  selector: FilterableOrderTagProps
  /**
   * The data to update the order tags with.
   */
  update: UpdateOrderTagDTO
}

export const updateOrderTagsStepId = "update-order-tags"
/**
 * This step updates order tags matching the specified filters.
 *
 * @example
 * const data = updateOrderTagsStep({
 *   selector: {
 *     id: "otag_123"
 *   },
 *   update: {
 *     value: "urgent"
 *   }
 * })
 */
export const updateOrderTagsStep = createStep(
  updateOrderTagsStepId,
  async (data: UpdateOrderTagsStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listOrderTags(data.selector, {
      select: selects,
      relations,
    })

    const orderTags = await service.updateOrderTags(data.selector, data.update)
    return new StepResponse(orderTags, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    // `upsertOrderTags` isn't part of `IOrderModuleService` - Task 9 scoped
    // the interface to only the methods order-tags actually need - so
    // compensation restores each tag individually with `updateOrderTags`
    // instead of a single upsert batch.
    //
    // `prevData` is only fetched with the fields present in the original
    // `data.update` (via `getSelectsAndRelationsFromObjectArray`), so a
    // metadata-only update never selects `value`. Spreading the fetched
    // object - rather than hand-picking `value`/`metadata` - restores only
    // the fields that were actually fetched, mirroring
    // `upsertProductTags_`'s pass-through behavior and avoiding
    // `value: undefined` reaching MikroORM for a non-nullable column.
    await Promise.all(
      prevData.map((tag) => {
        const { id, ...update } = tag
        return service.updateOrderTags(id, update)
      })
    )
  }
)
