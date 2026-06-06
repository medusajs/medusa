import {
  FilterableOrderReturnReasonProps,
  IOrderModuleService,
  ReturnReasonUpdatableFields,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

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

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])
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
    if (!prevReturnReasons) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await promiseAll(
      prevReturnReasons.map((c) =>
        service.updateReturnReasons(c.id, {
          value: c.value,
          label: c.label,
          description: c.description,
          metadata: c.metadata,
        })
      )
    )
  }
)
