import {
  IOrderModuleService,
  RegisterOrderFulfillmentDTO,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const registerOrderFulfillmentStepId = "register-order-fullfillment"
/**
 * This step registers a fulfillment for an order.
 * 
 * @example
 * const data = registerOrderFulfillmentStep({
 *   order_id: "order_123",
 *   items: [{
 *     id: "item_123",
 *     quantity: 1
 *   }],
 * })
 */
export const registerOrderFulfillmentStep = createStep(
  registerOrderFulfillmentStepId,
  async (data: RegisterOrderFulfillmentDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.registerFulfillment(data)
    return new StepResponse(void 0, data.order_id)
  },
  async (orderId, { container }) => {
    if (!orderId) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.revertLastVersion(orderId)
  }
)
