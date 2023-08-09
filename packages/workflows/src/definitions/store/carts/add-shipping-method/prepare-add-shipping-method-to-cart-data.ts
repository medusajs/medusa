import { WorkflowTypes } from "@medusajs/types"
import { WorkflowDataPreparationArguments } from "../../../../helper"

type AddShippingMethodInputData =
  WorkflowTypes.CartWorkflow.AddShippingMethodToCartDTO

export async function prepareAddShippingMethodToCartWorkflowData({
  container,
  context,
  data,
}: WorkflowDataPreparationArguments<AddShippingMethodInputData>) {
  const { manager } = context

  const data_ = data

  const cartService = container.resolve("cartService").withTransaction(manager)
  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)
  const customShippingOptionService = container
    .resolve("customShippingOptionService")
    .withTransaction(manager)

  const cart = await cartService.retrieveWithTotals(data_.cart_id, {
    relations: [
      "shipping_methods",
      "shipping_methods.shipping_option",
      "items.variant.product.profiles",
      "payment_sessions",
    ],
  })

  const options = await customShippingOptionService.list({
    cart_id: data_.cart_id,
  })

  const customShippingOption = cartService.findCustomShippingOption(
    options,
    data_.option_id
  )

  const shippingMethodConfig = customShippingOption
    ? { cart_id: cart.id, price: customShippingOption.price }
    : { cart }

  const option = await shippingOptionService.retrieve(data_.option_id, {
    relations: ["requirements"],
  })

  return {
    shippingMethodConfig,
    cart,
    shippingOption: option,
    shippingMethodData: data_.data,
  }
}

prepareAddShippingMethodToCartWorkflowData.aliases = {
  input: "input",
}
