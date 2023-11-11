import { CartDTO, ShippingOptionDTO } from "@medusajs/types"
import { isDefined } from "@medusajs/utils"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  shippingOption: ShippingOptionDTO
  shippingMethodData: Record<string, unknown>
  cart: CartDTO
}

type InvokeOutput = {
  validatedData: Record<string, unknown>
}

async function invoke(input, data): Promise<InvokeOutput> {
  const { manager, container } = input

  const fulfillmentProvider = container.resolve("fulfillmentProviderService")

  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const { shippingOption, cart, shippingMethodData } = data

  if (isDefined(cart)) {
    await shippingOptionService.validateCartOption(shippingOption, cart)
  }

  const validatedShippingOptionData =
    await fulfillmentProvider.validateFulfillmentData(
      shippingOption,
      shippingMethodData,
      cart || {}
    )

  return {
    validatedData: validatedShippingOptionData,
  }
}

export const validateShippingOptionDataStep = createStep(
  "validateShippingOptionData",
  invoke
)
