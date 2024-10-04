import {
  CartDTO,
  ICartModuleService,
  IFulfillmentModuleService,
} from "@medusajs/framework/types"
import { Modules, arrayDifference } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface RefreshCartShippingMethodsStepInput {
  cart: CartDTO
}

export const refreshCartShippingMethodsStepId = "refresh-cart-shipping-methods"
/**
 * This step refreshes the shipping methods of a cart.
 */
export const refreshCartShippingMethodsStep = createStep(
  refreshCartShippingMethodsStepId,
  async (data: RefreshCartShippingMethodsStepInput, { container }) => {
    const { cart } = data
    const { shipping_methods: shippingMethods = [] } = cart

    if (!shippingMethods?.length) {
      return new StepResponse(void 0, [])
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const cartModule = container.resolve<ICartModuleService>(Modules.CART)

    const shippingOptionIds: string[] = shippingMethods.map(
      (sm) => sm.shipping_option_id!
    )

    const validShippingOptions =
      await fulfillmentModule.listShippingOptionsForContext(
        {
          id: shippingOptionIds,
          context: { ...cart, is_return: "false", enabled_in_store: "true" },
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
    const invalidShippingOptionIds = arrayDifference(
      shippingOptionIds,
      validShippingOptionIds
    )

    const shippingMethodsToDelete = shippingMethods
      .filter((sm) => invalidShippingOptionIds.includes(sm.shipping_option_id!))
      .map((sm) => sm.id)

    await cartModule.softDeleteShippingMethods(shippingMethodsToDelete)

    return new StepResponse(void 0, shippingMethodsToDelete)
  },
  async (shippingMethodsToRestore, { container }) => {
    if (shippingMethodsToRestore?.length) {
      const cartModule = container.resolve<ICartModuleService>(Modules.CART)

      await cartModule.restoreShippingMethods(shippingMethodsToRestore)
    }
  }
)
