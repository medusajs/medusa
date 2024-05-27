import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IOrderModuleService,
  RegisterOrderFulfillmentDTO,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type RegisterOrderFulfillmentStepInput = RegisterOrderFulfillmentDTO

export const registerOrderFulfillmentStepId = "register-order-fullfillment"
export const registerOrderFulfillmentStep = createStep(
  registerOrderFulfillmentStepId,
  async (data: RegisterOrderFulfillmentStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.registerFulfillment(data)
    return new StepResponse(void 0, data.order_id)
  },
  async (orderId, { container }) => {
    if (!orderId) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.revertLastVersion(orderId)
  }
)
