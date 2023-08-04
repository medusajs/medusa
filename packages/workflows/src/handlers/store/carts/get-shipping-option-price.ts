import { WorkflowArguments } from "../../../helper"

export async function getShippingOptionPrice({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    cart: any
    shippingOption: any
  }
  shippingOptionData: Record<string, unknown>
}>) {
  const { transactionManager: manager } = context

  const { cart, shippingOption } = data.input
  const { shippingOptionData } = data

  // let methodPrice
  // if (typeof config.price === "number") {
  //   methodPrice = config.price
  // } else {

  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const methodPrice = await shippingOptionService.getPrice(
    shippingOption,
    shippingOptionData,
    cart
  )

  return {
    shippingOptionPrice: methodPrice,
  }
}

getShippingOptionPrice.aliases = {
  input: "input",
  shippingOptionData: "shippingOptionData",
}
