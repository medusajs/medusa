import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"
import {
  CreateShippingMethodAdjustmentDTO,
  IOrderModuleService,
} from "@zjedene-medusa/framework/types"

export const createDraftOrderShippingMethodAdjustmentsStepId =
  "create-draft-order-shipping-method-adjustments"

/**
 * The details of the shipping method adjustments to create.
 */
export interface CreateDraftOrderShippingMethodAdjustmentsStepInput {
  /**
   * The shipping method adjustments to create.
   */
  shippingMethodAdjustmentsToCreate: CreateShippingMethodAdjustmentDTO[]
}

/**
 * This step creates shipping method adjustments for a draft order.
 *
 * @example
 * const data = createDraftOrderShippingMethodAdjustmentsStep({
 *   shippingMethodAdjustmentsToCreate: [
 *     {
 *       shipping_method_id: "sm_123",
 *       code: "PROMO_123",
 *       amount: 10,
 *     }
 *   ]
 * })
 */
export const createDraftOrderShippingMethodAdjustmentsStep = createStep(
  createDraftOrderShippingMethodAdjustmentsStepId,
  async function (
    data: CreateDraftOrderShippingMethodAdjustmentsStepInput,
    { container }
  ) {
    const { shippingMethodAdjustmentsToCreate = [] } = data

    if (!shippingMethodAdjustmentsToCreate?.length) {
      return new StepResponse(void 0, [])
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const shippingMethodAdjustments =
      await service.createOrderShippingMethodAdjustments(
        shippingMethodAdjustmentsToCreate
      )

    const createdShippingMethodAdjustments = shippingMethodAdjustments.map(
      (adjustment) => adjustment.id
    )

    return new StepResponse(
      createdShippingMethodAdjustments,
      createdShippingMethodAdjustments
    )
  },
  async function (createdShippingMethodAdjustments, { container }) {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (!createdShippingMethodAdjustments?.length) {
      return
    }

    await service.deleteOrderShippingMethodAdjustments(
      createdShippingMethodAdjustments
    )
  }
)
