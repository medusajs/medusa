import { ShippingOptionDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  shippingOption: ShippingOptionDTO
  shippingMethodData: Record<string, unknown>
  shippingMethodConfig: Record<string, unknown>
  shippingOptionPrice: number
}

export async function createShippingMethods({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>) {
  const { manager } = context

  const {
    shippingOptionPrice,
    shippingMethodData,
    shippingOption,
    shippingMethodConfig,
  } = data

  const toCreate = [
    {
      option: shippingOption,
      data: shippingMethodData,
      price: shippingOptionPrice,
      config: shippingMethodConfig,
    },
  ]

  const shippingOptionService = container.resolve("shippingOptionService")

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
