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
  price: number
  shippingOptionData: Record<string, unknown>
}>) {
  const { price, shippingOptionData } = data
  const { shippingOption, shippingMethodConfig } = data.input

  return {
    alias: "input",
    value: {
      shippingOption,
      price,
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
