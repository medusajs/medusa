import { WorkflowArguments } from "../../../helper"

export async function getShippingOptionPrice({
  container,
  context,
  data,
}: WorkflowArguments<{
  getOptionPriceData: {
    shippingOption: any
    shippingOptionData: any
    config: any
  }
}>) {
  const { transactionManager: manager } = context

  const { shippingOption, config, shippingOptionData } = data.getOptionPriceData

  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const methodPrice = await shippingOptionService.getPrice(
    shippingOption,
    shippingOptionData,
    config
  )

  return {
    shippingOptionPrice: methodPrice,
  }
}

getShippingOptionPrice.aliases = {
  input: "input",
  shippingOptionData: "shippingOptionData",
}
