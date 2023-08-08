import { isDefined } from "@medusajs/utils"
import { WorkflowArguments } from "../../../helper"

export async function validateShippingOptionForCart({
  container,
  context,
  data,
}: WorkflowArguments<{
  dataToValidate: {
    shippingOption: any
    shippingMethodData: any
    cart?: any
  }
}>) {
  const { manager } = context

  const fulfillmentProvider = container.resolve("fulfillmentProviderService")

  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const dataToValidate = data.dataToValidate

  if (isDefined(dataToValidate.cart)) {
    await shippingOptionService.validateCartOption(
      dataToValidate.shippingOption,
      dataToValidate.cart
    )
  }

  const validatedShippingOptionData =
    await fulfillmentProvider.validateFulfillmentData(
      dataToValidate.shippingOption,
      dataToValidate.shippingMethodData,
      dataToValidate.cart || {}
    )

  return validatedShippingOptionData
}

validateShippingOptionForCart.aliases = {
  dataToValidate: "dataToValidate",
}
