import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableOrderReturnReasonProps,
  IOrderModuleService,
  ReturnReasonUpdatableFields,
} from "@medusajs/types"
import {
  getSelectsAndRelationsFromObjectArray,
  promiseAll,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateReturnReasonStepInput = {
  selector: FilterableOrderReturnReasonProps
  update: ReturnReasonUpdatableFields
}

export const updateReturnReasonStepId = "update-return-reasons"
export const updateReturnReasonsStep = createStep(
  updateReturnReasonStepId,
  async (data: UpdateReturnReasonStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

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

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

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
