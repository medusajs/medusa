import {
  CreateOrderShippingMethodDTO,
  IOrderModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export interface CreateOrderShippingMethodsStepInput {
  shipping_methods: CreateOrderShippingMethodDTO[]
}

/**
 * This step creates order shipping methods.
 */
export const createOrderShippingMethods = createStep(
  "create-order-shipping-methods",
  async (input: CreateOrderShippingMethodsStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const created = await service.createShippingMethods(input.shipping_methods)

    return new StepResponse(
      created,
      created.map((c) => c.id)
    )
  },
  async (createdMethodIds, { container }) => {
    if (!createdMethodIds) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.deleteShippingMethods(createdMethodIds)
  }
)
