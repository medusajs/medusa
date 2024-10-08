import {
  CreateShippingMethodAdjustmentDTO,
  ICartModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface CreateShippingMethodAdjustmentsStepInput {
  shippingMethodAdjustmentsToCreate: CreateShippingMethodAdjustmentDTO[]
}

export const createShippingMethodAdjustmentsStepId =
  "create-shipping-method-adjustments"
/**
 * This step creates shipping method adjustments for a cart.
 */
export const createShippingMethodAdjustmentsStep = createStep(
  createShippingMethodAdjustmentsStepId,
  async (data: CreateShippingMethodAdjustmentsStepInput, { container }) => {
    const { shippingMethodAdjustmentsToCreate = [] } = data
    const cartModuleService: ICartModuleService = container.resolve(
      Modules.CART
    )

    const createdShippingMethodAdjustments =
      await cartModuleService.addShippingMethodAdjustments(
        shippingMethodAdjustmentsToCreate
      )

    return new StepResponse(void 0, createdShippingMethodAdjustments)
  },
  async (createdShippingMethodAdjustments, { container }) => {
    const cartModuleService: ICartModuleService = container.resolve(
      Modules.CART
    )

    if (!createdShippingMethodAdjustments?.length) {
      return
    }

    await cartModuleService.softDeleteShippingMethodAdjustments(
      createdShippingMethodAdjustments.map((c) => c.id)
    )
  }
)
