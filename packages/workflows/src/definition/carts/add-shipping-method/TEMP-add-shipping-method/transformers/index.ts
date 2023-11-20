import { ShippingOption } from "@medusajs/medusa"
import { CartDTO } from "@medusajs/types"

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
export const originalAndNewCartTransformer = (context, preparedData, cart) => {
  return {
    cart,
    originalCart: preparedData.cart,
  }
}

export const createMethodsDataTransformer = (
  context,
  preparedData,
  validatedData,
  price
) => {
  return {
    option: preparedData.shippingOption,
    data: validatedData,
    config: preparedData.shippingMethodConfig,
    price: price.price,
  }
}

export const prepareDeleteMethodsDataTransformer = (
  context,
  preparedData,
  shippingMethods
) => {
  const { cart } = preparedData

  if (!cart.shipping_methods?.length) {
    return []
  }

  const toDelete: any[] = []

  for (const method of cart.shipping_methods) {
    if (
      shippingMethods.shippingMethods.some(
        (m) =>
          m.shipping_option.profile_id === method.shipping_option.profile_id
      )
    ) {
      toDelete.push(method)
    }
  }

  return {
    shippingMethods: toDelete,
  }
}
