import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CartDTO } from "@medusajs/types"
import { arrayDifference, MedusaError } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { IFulfillmentModuleService } from "../../../../../types/dist/fulfillment/service"

interface StepInput {
  cart: CartDTO
  option_ids: string[]
}

export const validateCartShippingOptionsStepId =
  "validate-cart-shipping-options"
export const validateCartShippingOptionsStep = createStep(
  validateCartShippingOptionsStepId,
  async (data: StepInput, { container }) => {
    const { option_ids: optionIds = [], cart } = data

    if (!optionIds.length) {
      return new StepResponse(void 0)
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const shippingOptions = await fulfillmentModule.listShippingOptions(
      { id: optionIds },
      { select: ["id", "name"], take: null }
    )

    const diff = arrayDifference(
      optionIds,
      shippingOptions.map((o) => o.id)
    )

    if (diff.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Shipping Options (${diff.join(", ")}) not found`
      )
    }

    const validShippingOptions =
      await fulfillmentModule.listShippingOptionsForContext(
        {
          id: optionIds,
          context: { ...cart },
          address: {
            country_code: cart.shipping_address?.country_code,
            province_code: cart.shipping_address?.province,
            city: cart.shipping_address?.city,
            postal_expression: cart.shipping_address?.postal_code,
          },
        },
        { relations: ["rules"] }
      )

    const invalidOptionIds = arrayDifference(
      optionIds,
      validShippingOptions.map((o) => o.id)
    )

    if (invalidOptionIds.length) {
      const invalidOptionNames = shippingOptions
        .filter((o) => invalidOptionIds.includes(o.id))
        .map((o) => o.name)
        .join(",")

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Shipping Options (${invalidOptionNames}) are invalid for cart. Add a valid shipping option or remove existing invalid shipping options before continuing.`
      )
    }

    return new StepResponse(void 0)
  }
)
