import {
  CreateShippingMethodAdjustmentDTO,
  ICartModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  shippingMethodAdjustmentsToCreate: CreateShippingMethodAdjustmentDTO[]
}

export const createShippingMethodAdjustmentsStepId =
  "create-shipping-method-adjustments"
export const createShippingMethodAdjustmentsStep = createStep(
  createShippingMethodAdjustmentsStepId,
  async (data: StepInput, { container }) => {
    const { shippingMethodAdjustmentsToCreate = [] } = data
    const cartModuleService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    const createdShippingMethodAdjustments =
      await cartModuleService.addShippingMethodAdjustments(
        shippingMethodAdjustmentsToCreate
      )

    return new StepResponse(void 0, createdShippingMethodAdjustments)
  },
  async (createdShippingMethodAdjustments, { container }) => {
    const cartModuleService: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    if (!createdShippingMethodAdjustments?.length) {
      return
    }

    await cartModuleService.softDeleteShippingMethodAdjustments(
      createdShippingMethodAdjustments.map((c) => c.id)
    )
  }
)
