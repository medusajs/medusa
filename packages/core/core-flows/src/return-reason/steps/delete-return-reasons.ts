import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IOrderModuleService } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type DeleteReturnReasonStepInput = string[]

export const deleteReturnReasonStepId = "delete-return-reasons"
export const deleteReturnReasonStep = createStep(
  deleteReturnReasonStepId,
  async (ids: DeleteReturnReasonStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.softDeleteReturnReasons(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevReturnReasons, { container }) => {
    if (!prevReturnReasons) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.restoreReturnReasons(prevReturnReasons)
  }
)
