import {
  FindConfig,
  IFulfillmentModuleService,
  ShippingOptionDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  context: Record<string, unknown>
  config?: FindConfig<ShippingOptionDTO>
}

export const listShippingOptionsForContextStepId =
  "list-shipping-options-for-context"
export const listShippingOptionsForContextStep = createStep(
  listShippingOptionsForContextStepId,
  async (data: StepInput, { container }) => {
    const fulfillmentService = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const shippingOptions =
      await fulfillmentService.listShippingOptionsForContext(
        data.context,
        data.config
      )

    return new StepResponse(shippingOptions)
  }
)
