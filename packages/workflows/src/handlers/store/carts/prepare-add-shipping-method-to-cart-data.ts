import { WorkflowArguments } from "../../../helper"

export async function prepareAddShippingMethodToCartWorkflowData({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: { cart_id: string; option_id: string; data: Record<string, unknown> }
}) {
  const { transactionManager: manager } = context

  const cartService = container.resolve("cartService").withTransaction(manager)
  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)
  const customShippingOptionService = container
    .resolve("customShippingOptionService")
    .withTransaction(manager)

  const cart = await cartService.retrieveWithTotals(data.cart_id, {
    relations: [
      "shipping_methods",
      "shipping_methods.shipping_option",
      "items.variant.product.profiles",
      "payment_sessions",
    ],
  })

  const options = await customShippingOptionService.list({
    cart_id: data.cart_id,
  })

  const customShippingOption = cartService.findCustomShippingOption(
    options,
    data.option_id
  )

  const shippingMethodConfig = customShippingOption
    ? { cart_id: cart.id, price: customShippingOption.price }
    : { cart }

  const option = await shippingOptionService.retrieve(data.option_id, {
    relations: ["requirements"],
  })

  return {
    shippingMethodConfig,
    cart,
    option,
    shippingMethodData: data.data,
  }
}
