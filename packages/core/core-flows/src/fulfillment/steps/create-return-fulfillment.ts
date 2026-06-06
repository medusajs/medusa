import {
  FulfillmentTypes,
  IFulfillmentModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createReturnFulfillmentStepId = "create-return-fulfillment"
/**
 * This step creates a fulfillment for a return.
 *
 * @example
 * const data = createReturnFulfillmentStep({
 *   location_id: "sloc_123",
 *   provider_id: "provider_123",
 *   delivery_address: {
 *     first_name: "John",
 *     last_name: "Doe",
 *     address_1: "Test Street 1",
 *     city: "Test City",
 *     postal_code: "12345",
 *     country_code: "US",
 *     phone: "123456789",
 *   },
 *   items: [
 *     {
 *       title: "Shirt",
 *       sku: "shirt",
 *       quantity: 1,
 *       barcode: "123456789",
 *     }
 *   ]
 * })
 */
export const createReturnFulfillmentStep = createStep(
  createReturnFulfillmentStepId,
  async (data: FulfillmentTypes.CreateFulfillmentDTO, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const fulfillment = await service.createReturnFulfillment(data)

    return new StepResponse(fulfillment, fulfillment.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    // await service.cancelReturnFulfillment(id) // TODO: Implement cancelReturnFulfillment
    await service.cancelFulfillment(id)
  }
)
