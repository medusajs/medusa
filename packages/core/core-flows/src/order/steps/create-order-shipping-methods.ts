import {
  CreateOrderShippingMethodDTO,
  IOrderModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of creating order shipping methods.
 */
export interface CreateOrderShippingMethodsStepInput {
  /**
   * The shipping methods to create.
   */
  shipping_methods: CreateOrderShippingMethodDTO[]
}

/**
 * This step creates order shipping methods.
 */
export const createOrderShippingMethods = createStep(
  "create-order-shipping-methods",
  async (input: CreateOrderShippingMethodsStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const created = await service.createOrderShippingMethods(
      input.shipping_methods
    )

    return new StepResponse(
      created,
      created.map((c) => c.id)
    )
  },
  async (createdMethodIds, { container }) => {
    if (!createdMethodIds) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteOrderShippingMethods(createdMethodIds)
  }
)
