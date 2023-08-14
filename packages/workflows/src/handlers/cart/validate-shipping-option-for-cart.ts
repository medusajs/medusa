import { CartDTO, ShippingOptionDTO } from "@medusajs/types"
import { isDefined } from "@medusajs/utils"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  shippingOption: ShippingOptionDTO
  shippingMethodData: Record<string, unknown>
  cart: CartDTO
}

type HandlerOutput = {
  validatedData: Record<string, unknown>
}

export async function validateShippingOptionForCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<HandlerOutput> {
  const { manager } = context

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

validateShippingOptionForCart.aliases = {
  shippingOption: "shippingOption",
  shippingMethodData: "shippingMethodData",
  cart: "cart",
}
