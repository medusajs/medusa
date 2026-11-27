import {
  FilterableOrderReturnReasonProps,
  IOrderModuleService,
  ReturnReasonUpdatableFields,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
  removeUndefined,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update return reasons.
 */
type UpdateReturnReasonStepInput = {
  /**
   * The filters to select the return reasons to update.
   */
  selector: FilterableOrderReturnReasonProps
  /**
   * The data to update in the return reasons.
   */
  update: ReturnReasonUpdatableFields
}

export const updateReturnReasonStepId = "update-return-reasons"
/**
 * This step updates return reasons matching the specified filters.
 * 
 * @example
 * const data = updateReturnReasonsStep({
 *   selector: {
 *     id: "rr_123",
 *   },
 *   update: {
 *     value: "damaged",
 *   }
 * })
 */
export const updateReturnReasonsStep = createStep(
  updateReturnReasonStepId,
  async (data: UpdateReturnReasonStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(
      [data.update],
      {
        objectFields: ["metadata"],
        requiredFields: ["id", "value", "label", "description", "metadata"],
      }
    )
    const prevReturnReasons = await service.listReturnReasons(data.selector, {
      select: selects,
      relations,
    })

    const reasons = await service.updateReturnReasons(
      data.selector,
      data.update
    )

    return new StepResponse(reasons, prevReturnReasons)
  },
  async (prevReturnReasons, { container }) => {
    if (!prevReturnReasons?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await promiseAll(
      prevReturnReasons.map((c) =>
        service.updateReturnReasons(
          c.id,
          removeUndefined({
            value: c.value,
            label: c.label,
            description: c.description,
            metadata: c.metadata,
          })
        )
      )
    )
  }
)
