import { WorkflowArguments } from "../../../helper"

export async function getShippingOptionPrice({
  container,
  context,
  data,
}: WorkflowArguments<{
  getOptionPriceData: {
    shippingOption: any
    shippingOptionData: any
    shippingMethodConfig: any
  }
}>) {
  const { manager } = context

  const { shippingOption, shippingMethodConfig, shippingOptionData } =
    data.getOptionPriceData

  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const methodPrice = await shippingOptionService.getPrice(
    shippingOption,
    shippingOptionData,
    shippingMethodConfig
  )

  return { price: methodPrice }
}

getShippingOptionPrice.aliases = {
  input: "input",
  shippingOptionData: "shippingOptionData",
}
