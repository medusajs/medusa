import { ShippingOptionDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  shippingOption: ShippingOptionDTO
  shippingMethodData: Record<string, unknown>
  shippingMethodConfig: Record<string, unknown>
}

export async function getShippingOptionPrice({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>) {
  const { manager } = context

  const { shippingOption, shippingMethodConfig, shippingMethodData } = data

  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const methodPrice = await shippingOptionService.getPrice(
    shippingOption,
    shippingMethodData,
    shippingMethodConfig
  )

  return { shippingOptionPrice: methodPrice }
}

getShippingOptionPrice.aliases = {
  shippingMethodData: "shippingMethodData",
  shippingMethodConfig: "shippingMethodConfig",
  shippingOption: "shippingOption",
}
