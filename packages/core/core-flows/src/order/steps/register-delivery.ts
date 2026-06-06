import {
  IOrderModuleService,
  RegisterOrderDeliveryDTO,
} from "@zjedene-medusa/framework/types"
import { ModuleRegistrationName } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const registerOrderDeliveryStepId = "register-order-delivery"
/**
 * This step registers a delivery for an order fulfillment.
 */
export const registerOrderDeliveryStep = createStep(
  registerOrderDeliveryStepId,
  async (data: RegisterOrderDeliveryDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.registerDelivery(data)

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
