import { CartDTO, IFulfillmentModuleService } from "@medusajs/types"
import {
  MedusaError,
  ModuleRegistrationName,
  arrayDifference,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cart: CartDTO
  shippingOptionsContext: {
    enabled_in_store?: "true" | "false"
    is_return?: "true" | "false"
  }
  option_ids: string[]
}

export const validateCartShippingOptionsStepId =
  "validate-cart-shipping-options"
export const validateCartShippingOptionsStep = createStep(
  validateCartShippingOptionsStepId,
  async (data: StepInput, { container }) => {
    const { option_ids: optionIds = [], cart, shippingOptionsContext } = data

    if (!optionIds.length) {
      return new StepResponse(void 0)
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const validShippingOptions =
      await fulfillmentModule.listShippingOptionsForContext(
        {
          id: optionIds,
          context: shippingOptionsContext,
          address: {
            country_code: cart.shipping_address?.country_code,
            province_code: cart.shipping_address?.province,
            city: cart.shipping_address?.city,
            postal_expression: cart.shipping_address?.postal_code,
          },
        },
        { relations: ["rules"] }
      )

    const validShippingOptionIds = validShippingOptions.map((o) => o.id)
    const invalidOptionIds = arrayDifference(optionIds, validShippingOptionIds)

    if (invalidOptionIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Shipping Options are invalid for cart.`
      )
    }

    return new StepResponse(void 0)
  }
)
