import {
  CreateLineItemAdjustmentDTO,
  ICartModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  lineItemAdjustmentsToCreate: CreateLineItemAdjustmentDTO[]
}

export const createLineItemAdjustmentsStepId = "create-line-item-adjustments"
export const createLineItemAdjustmentsStep = createStep(
  createLineItemAdjustmentsStepId,
  async (data: StepInput, { container }) => {
    const { lineItemAdjustmentsToCreate = [] } = data
    const cartModuleService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    const createdLineItemAdjustments =
      await cartModuleService.addLineItemAdjustments(
        lineItemAdjustmentsToCreate
      )

    return new StepResponse(void 0, createdLineItemAdjustments)
  },
  async (createdLineItemAdjustments, { container }) => {
    const cartModuleService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    if (!createdLineItemAdjustments?.length) {
      return
    }

    await cartModuleService.softDeleteLineItemAdjustments(
      createdLineItemAdjustments.map((c) => c.id)
    )
  }
)
