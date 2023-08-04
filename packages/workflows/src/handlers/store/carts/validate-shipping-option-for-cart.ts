import { WorkflowTypes } from "@medusajs/types"
import { isDefined } from "@medusajs/utils"
import { WorkflowArguments } from "../../../helper"

type ValidateShippingOptionForCartInputData =
  WorkflowTypes.CartTypes.ValidateShippingOptionForCartDTO

export async function validateShippingOptionForCart({
  container,
  context,
  data,
}: WorkflowArguments<{
  dataToValidate: ValidateShippingOptionForCartInputData
}>) {
  const { transactionManager: manager } = context

  const fulfillmentProvider = container.resolve("fulfillmentProviderService")

  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const dataToValidate = data.dataToValidate

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

validateShippingOptionForCart.aliases = {
  dataToValidate: "dataToValidate",
}
