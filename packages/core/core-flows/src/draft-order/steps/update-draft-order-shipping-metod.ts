import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import type {
  BigNumberInput,
  IOrderModuleService,
} from "@medusajs/framework/types"

export const updateDraftOrderShippingMethodStepId =
  "update-draft-order-shipping-method"

/**
 * The details of the shipping method to update in a draft order.
 */
export interface UpdateDraftOrderShippingMethodStepInput {
  /**
   * The ID of the draft order.
   */
  order_id: string
  /**
   * The ID of the shipping method to update.
   */
  shipping_method_id: string
  /**
   * The ID of the shipping method's option.
   */
  shipping_option_id?: string
  /**
   * The amount of the shipping method.
   */
  amount?: BigNumberInput
  /**
   * The metadata of the shipping method.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * This step updates the shipping method of a draft order.
 *
 * @example
 * const data = updateDraftOrderShippingMethodStep({
 *   order_id: "order_123",
 *   shipping_method_id: "sm_123",
 *   amount: 10,
 * })
 */
export const updateDraftOrderShippingMethodStep = createStep(
  updateDraftOrderShippingMethodStepId,
  async function (
    input: UpdateDraftOrderShippingMethodStepInput,
    { container }
  ) {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const [beforeUpdate] = await service.listOrderShippingMethods(
      {
        id: input.shipping_method_id,
      },
      {
        take: 1,
        select: ["id", "shipping_option_id", "amount"],
      }
    )

    if (!beforeUpdate) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `A shipping method with id ${input.shipping_method_id} was not found`
      )
    }

    const [updatedMethod] = await service.updateOrderShippingMethods([
      {
        id: input.shipping_method_id,
        shipping_option_id: input.shipping_option_id,
        amount: input.amount,
      },
    ])

    return new StepResponse(
      {
        before: beforeUpdate,
        after: updatedMethod,
      },
      beforeUpdate
    )
  },
  async (input, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (!input) {
      return
    }

    await service.updateOrderShippingMethods([input])
  }
)
