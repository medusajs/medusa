import { isDefined } from "@medusajs/utils"
import { InputAlias } from "../../../definitions"
import { WorkflowArguments } from "../../../helper"

type CreateShippingMethodDTO = {
  option: any // shipping option
  cart: any // cart
  data: Record<string, unknown>
}

export async function validateShippingOptionForCart({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: {
    [InputAlias.ShippingOptionToValidate]: CreateShippingMethodDTO
  }
}) {
  const { transactionManager: manager } = context

  const fulfillmentProvider = container.resolve("fulfillmentProviderService")

  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const dataToValidate = data[InputAlias.ShippingOptionToValidate]

  // Question: requirements are required on the shipping option, how do we ensure this? retrieve anew or throw?

  if (isDefined(dataToValidate.cart)) {
    // expects the cart from the preparation step
    await shippingOptionService.validateCartOption(
      dataToValidate.option,
      dataToValidate.cart
    )
  }

  const validatedData = await fulfillmentProvider.validateFulfillmentData(
    dataToValidate.option,
    dataToValidate.data,
    dataToValidate.cart || {}
  )

  return {
    validatedShippingOptionData: validatedData,
  }
}
