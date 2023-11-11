import { ShippingOptionDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../../../../helper"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  shippingOption: ShippingOptionDTO
  shippingMethodData: Record<string, unknown>
  shippingMethodConfig: Record<string, unknown>
}

type InvokeOutput = {
  price: number
}

async function invoke({
  container,
  context,
  data,
}: WorkflowArguments<InvokeInput>): Promise<InvokeOutput> {
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

  return { price: methodPrice }
}

export const getShippingOptionPriceStep = createStep(
  "getShippingOptionPrice",
  invoke
)
