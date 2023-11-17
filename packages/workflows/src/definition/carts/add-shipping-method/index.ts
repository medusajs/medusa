import { ShippingOption } from "@medusajs/medusa"
import { CartDTO, ShippingMethodDTO } from "@medusajs/types"
import { createWorkflow, transform } from "../../../utils/composer"
import * as steps from "./TEMP-add-shipping-method/steps"

export const getCart = async (input, context): Promise<CartDTO> => {
  const cartService = context.container
    .resolve("cartService")
    .withTransaction(context.manager)

  const cart = await cartService.retrieveWithTotals(input.cart_id, {
    relations: [
      "items.variant.product.profiles",
      "items.adjustments",
      "discounts.rule",
      "gift_cards",
      "shipping_methods.shipping_option",
      "billing_address",
      "shipping_address",
      "region.tax_rates",
      "region.payment_providers",
      "payment_sessions",
      "customer",
    ],
  })

  return cart
}

export const getShippingMethodConfig = async (
  cart,
  context
): Promise<{ cart_id?: string; price?: number; cart?: CartDTO }> => {
  const customShippingOptionService = context.container
    .resolve("customShippingOptionService")
    .withTransaction(context.manager)

  const cartService = context.container
    .resolve("cartService")
    .withTransaction(context.manager)

  const options = await customShippingOptionService.list({
    cart_id: cart.id,
  })

  const customShippingOption = await cartService.findCustomShippingOption(
    options,
    "optionId"
  )

  const shippingMethodConfig = customShippingOption
    ? { cart_id: cart.id, price: customShippingOption.price }
    : { cart }

  return shippingMethodConfig
}

export const getShippingOption = async (
  input,
  context
): Promise<ShippingOption> => {
  const shippingOptionService = context.container
    .resolve("shippingOptionService")
    .withTransaction(context.manager)

  const option = await shippingOptionService.retrieve(input.option_id, {
    relations: ["requirements"],
  })

  return option
}

type WorkflowInput = {
  cart_id: string
  option_id: string
  data: Record<string, unknown>
}

type WorkflowOutput = {
  cart: CartDTO
}

export const addShippingMethodToCartWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput,
  any
>("AddShippingMethod", function (input) {
  /** Get Cart */
  const cart = transform(input, getCart)

  /** Get ShippingMethod config */
  const shippingMethodConfig = transform(cart, getShippingMethodConfig)

  /** Get ShippingOption */
  const shippingOption = transform(input, getShippingOption)

  /** Validate ShippingOption for Cart */
  const validatedData = steps.validateShippingOptionForCartStep({
    shippingOption,
    cart,
    shippingMethodData: input.data,
  })

  /** Get ShippingOptionPrice */
  const price = steps.getShippingOptionPriceStep({
    shippingOption,
    shippingMethodData: validatedData,
    shippingMethodConfig: shippingMethodConfig,
  })

  const shippingMethodsToCreate = transform(
    { shippingOption, validatedData, shippingMethodConfig, price },
    (input) => {
      return {
        option: input.shippingOption,
        data: input.validatedData,
        config: input.shippingMethodConfig,
        price: input.price,
      }
    }
  )

  /** Create ShippingMethods */
  const createdShippingMethodsData = steps.createShippingMethodsStep({
    shippingMethods: shippingMethodsToCreate,
  })

  // /** Validate LineItem shipping */
  steps.validateLineItemShippingStep({ cart })

  /** Prepare data for deleting old unused ShippingMethods */
  const shippingMethodsToDelete = transform(
    { cart, shippingMethods: createdShippingMethodsData.shippingMethods },
    (input): ShippingMethodDTO[] => {
      const { cart, shippingMethods } = input

      if (!cart.shipping_methods?.length) {
        return []
      }

      const toDelete: any[] = []

      for (const method of cart.shipping_methods) {
        if (
          shippingMethods.some(
            (m) =>
              m.shipping_option.profile_id === method.shipping_option.profile_id
          )
        ) {
          toDelete.push(method)
        }
      }

      return toDelete
    }
  )

  /** Delete ShippingMethods */
  steps.deleteShippingMethodsStep(shippingMethodsToDelete)

  /** Retrieve updated Cart */
  const freshCart = transform(input, getCart)

  /** Adjust shipping on Cart */
  steps.adjustFreeShippingStep({ cart: freshCart, originalCart: cart })

  /** Retrieve updated Cart */
  const anotherFreshCart = transform(input, getCart)

  /** Upsert PaymentSessions */
  steps.upsertPaymentSessionsStep({
    cart: anotherFreshCart,
    originalCart: cart,
  })

  return transform({ cart }, (input) => ({ cart: input.cart }))
})
