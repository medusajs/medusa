import { WorkflowArguments } from "../../helper"

export async function createShippingMethods({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    shippingOption: any
    shippingMethodConfig: any
    shippingOptionPrice: any
    shippingOptionData: Record<string, unknown>
  }
}>) {
  const { manager } = context

  const {
    shippingOptionPrice,
    shippingOptionData,
    shippingOption,
    shippingMethodConfig,
  } = data.input

  const toCreate = [
    {
      option: shippingOption,
      data: shippingOptionData,
      price: shippingOptionPrice.price,
      config: shippingMethodConfig,
    },
  ]

  const shippingOptionService = container.resolve("shippingOptionService")

  console.log("To create", toCreate)

  const shippingMethods = await shippingOptionService
    .withTransaction(manager)
    .createShippingMethods(toCreate)

  return shippingMethods
}

createShippingMethods.aliases = {
  shippingOption: "shippingOption",
  shippingMethodConfig: "shippingMethodConfig",
  shippingOptionPrice: "shippingOptionPrice",
  shippingOptionData: "shippingOptionData",
}
