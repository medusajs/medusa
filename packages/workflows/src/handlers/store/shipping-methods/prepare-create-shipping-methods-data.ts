import { WorkflowArguments } from "../../../helper"

export async function prepareShippingMethodsForCreate({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    shippingOption: any
    shippingMethodConfig: any
  }
  shippingOptionPrice: number
  shippingOptionData: Record<string, unknown>
}>) {
  const { shippingOptionPrice, shippingOptionData } = data
  const { shippingOption, shippingMethodConfig } = data.input

  return {
    alias: "input",
    value: {
      shippingOption,
      shippingOptionPrice,
      shippingMethodConfig,
      shippingOptionData,
    },
  }
}

prepareShippingMethodsForCreate.aliases = {
  input: "input",
  price: "price",
  shippingOptionData: "shippingOptionData",
}
