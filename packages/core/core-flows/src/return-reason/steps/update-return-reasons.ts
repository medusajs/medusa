import {
  FilterableOrderReturnReasonProps,
  IOrderModuleService,
  ReturnReasonUpdatableFields,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

type UpdateReturnReasonStepInput = {
  selector: FilterableOrderReturnReasonProps
  update: ReturnReasonUpdatableFields
}

export const updateReturnReasonStepId = "update-return-reasons"
/**
 * This step updates return reasons matching the specified filters.
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
