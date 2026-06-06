import {
  CreateShippingMethodAdjustmentDTO,
  ICartModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the shipping method adjustments to create.
 */
export interface CreateShippingMethodAdjustmentsStepInput {
  /**
   * The shipping method adjustments to create.
   */
  shippingMethodAdjustmentsToCreate: CreateShippingMethodAdjustmentDTO[]
}

export const createShippingMethodAdjustmentsStepId =
  "create-shipping-method-adjustments"
/**
 * This step creates shipping method adjustments for a cart.
 *
 * @example
 * const data = createShippingMethodAdjustmentsStep({
 *   "shippingMethodAdjustmentsToCreate": [{
 *     "shipping_method_id": "sm_123",
 *     "code": "10OFF",
 *     "amount": 10
 *   }]
 * })
 */
export const createShippingMethodAdjustmentsStep = createStep(
  createShippingMethodAdjustmentsStepId,
  async (data: CreateShippingMethodAdjustmentsStepInput, { container }) => {
    const { shippingMethodAdjustmentsToCreate = [] } = data

    if (!shippingMethodAdjustmentsToCreate?.length) {
      return new StepResponse(void 0, [])
    }

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
