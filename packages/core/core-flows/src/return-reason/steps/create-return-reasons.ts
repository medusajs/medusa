import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateOrderReturnReasonDTO,
  IOrderModuleService,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createReturnReasonsStepId = "create-return-reasons"
export const createReturnReasonsStep = createStep(
  createReturnReasonsStepId,
  async (data: CreateOrderReturnReasonDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const createdReturnReasons = await service.createReturnReasons(data)

    return new StepResponse(
      createdReturnReasons,
      createdReturnReasons.map(
        (createdReturnReasons) => createdReturnReasons.id
      )
    )
  },
  async (createdReturnReasonIds, { container }) => {
    if (!createdReturnReasonIds?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.deleteReturnReasons(createdReturnReasonIds)
  }
)
