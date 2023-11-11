import { ShippingOptionDTO } from "@medusajs/types"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  shippingOption: ShippingOptionDTO
  shippingMethodData: Record<string, unknown>
  shippingMethodConfig: Record<string, unknown>
}

type InvokeOutput = {
  price: number
}

async function invoke(input, data): Promise<InvokeOutput> {
  const { manager, container } = input

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
