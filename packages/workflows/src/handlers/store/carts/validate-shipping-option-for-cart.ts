import { WorkflowTypes } from "@medusajs/types"
import { isDefined } from "@medusajs/utils"
import { InputAlias } from "../../../definitions"
import { WorkflowArguments } from "../../../helper"

type ValidateShippingOptionForCartInputData =
  WorkflowTypes.CartTypes.ValidateShippingOptionForCartDTO

const ValidateShippingOptionForCartInputDataAlias =
  "alidateShippingOptionForCartInputData"

export async function validateShippingOptionForCart({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: {
    // eslint-disable-next-line max-len
    [InputAlias.ShippingOptionToValidate]: ValidateShippingOptionForCartInputData
  }
}) {
  const { transactionManager: manager } = context

  const fulfillmentProvider = container.resolve("fulfillmentProviderService")

  const shippingOptionService = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const dataToValidate = data[InputAlias.ShippingOptionToValidate]

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
  ValidateShippingOptionForCartInputDataAlias:
    ValidateShippingOptionForCartInputDataAlias,
}
