import { WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../../helper"

type CreateShippingMethodsInputData =
  WorkflowTypes.CartTypes.CreateShippingMethodsDTO

export async function createShippingMethods({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    cart: any
    shippingOption: any
    shippingMethodConfig: any
  }
  price: number
  shippingOptionData: Record<string, unknown>
}>) {
  const { transactionManager: manager } = context

  const { price, shippingOptionData } = data
  const { shippingOption, cart, shippingMethodConfig } = data.input

  const toCreate = [
    {
      option: shippingOption,
      data: shippingOptionData,
      price,
      config: shippingMethodConfig,
    },
  ]

  const shippingMethodService = container.resolve("shippingMethodService")

  const created = await shippingMethodService
    .withTransction(manager)
    .createShippingMethods(toCreate)

  return {
    createdShippingMethods: created,
  }
}

createShippingMethods.aliases = {
  input: "input",
  price: "price",
  shippingOptionData: "shippingOptionData",
}
