import { IFulfillmentModuleService } from "@medusajs/types"
import { MedusaError, ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const validateShipmentStepId = "validate-shipment"
export const validateShipmentStep = createStep(
  validateShipmentStepId,
  async (id: string, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )
    const fulfillment = await service.retrieveFulfillment(id, {
      select: ["shipped_at", "canceled_at", "shipping_option_id"],
    })

    if (fulfillment.shipped_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Shipment has already been created"
      )
    }

    if (fulfillment.canceled_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot create shipment for a canceled fulfillment"
      )
    }

    if (!fulfillment.shipping_option_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot create shipment without a Shipping Option"
      )
    }

    return new StepResponse(void 0)
  }
)
