import { WorkflowArguments } from "../../../../helper"

export async function prepareGetShippingOptionPriceData({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    shippingOption: any
    shippingMethodConfig
  }
  shippingOptionData: Record<string, unknown>
}>) {
  const { shippingOption, shippingMethodConfig } = data.input
  const { shippingOptionData } = data

  return {
    alias: "getOptionPriceData",
    value: {
      shippingOption,
      shippingOptionData,
      shippingMethodConfig,
    },
  }
}

prepareGetShippingOptionPriceData.aliases = {
  input: "input",
  shippingOptionData: "shippingOptionData",
}
