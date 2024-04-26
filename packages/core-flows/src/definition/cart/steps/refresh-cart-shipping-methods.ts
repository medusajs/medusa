import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CartDTO, ICartModuleService } from "@medusajs/types"
import { arrayDifference } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { IFulfillmentModuleService } from "../../../../../types/dist/fulfillment/service"

interface StepInput {
  cart: CartDTO
}

export const refreshCartShippingMethodsStepId = "refresh-cart-shipping-methods"
export const refreshCartShippingMethodsStep = createStep(
  refreshCartShippingMethodsStepId,
  async (data: StepInput, { container }) => {
    const { cart } = data
    const { shipping_methods: shippingMethods = [] } = cart

    if (!shippingMethods?.length) {
      return new StepResponse(void 0)
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const cartModule = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const shippingMethodsToDelete: string[] = []
    const shippingOptionIds: string[] = shippingMethods.map(
      (sm) => sm.shipping_option_id!
    )

    const shippingOptions = await fulfillmentModule.listShippingOptions(
      { id: shippingOptionIds },
      { select: ["id", "name"], take: null }
    )

    const diff = arrayDifference<string>(
      shippingOptionIds,
      shippingOptions.map((o) => o.id)
    )

    // If any shipping methods are found without shipping_option_id, delete them
    if (diff.length) {
      shippingMethodsToDelete.push(...diff)
    }

    const validShippingOptions =
      await fulfillmentModule.listShippingOptionsForContext(
        {
          id: shippingOptionIds,
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
      shippingOptionIds,
      validShippingOptions.map((o) => o.id)
    )

    if (invalidOptionIds.length) {
      shippingMethodsToDelete.push(...invalidOptionIds)
    }

    if (shippingMethodsToDelete.length) {
      await cartModule.softDeleteShippingMethods(shippingMethodsToDelete)
    }

    return new StepResponse(void 0, shippingMethodsToDelete)
  },
  async (shippingMethodsToRestore, { container }) => {
    if (shippingMethodsToRestore?.length) {
      const cartModule = container.resolve<ICartModuleService>(
        ModuleRegistrationName.CART
      )

      await cartModule.restoreShippingMethods(shippingMethodsToRestore)
    }
  }
)
