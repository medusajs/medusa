import { WorkflowArguments } from "../../../helper"

export async function prepareGetShippingOptionPriceData({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    shippingOption: any
    config
  }
  shippingOptionData: Record<string, unknown>
}>) {
  const { shippingOption, config } = data.input
  const { shippingOptionData } = data

  return {
    alias: "getOptionPriceData",
    value: {
      shippingOption,
      shippingOptionData,
      config,
    },
  }
}

prepareGetShippingOptionPriceData.aliases = {
  input: "input",
  shippingOptionData: "shippingOptionData",
}
