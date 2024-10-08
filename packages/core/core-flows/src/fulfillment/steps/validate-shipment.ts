import { IFulfillmentModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const validateShipmentStepId = "validate-shipment"
/**
 * This step validates that a shipment can be created for a fulfillment.
 */
export const validateShipmentStep = createStep(
  validateShipmentStepId,
  async (id: string, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
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
