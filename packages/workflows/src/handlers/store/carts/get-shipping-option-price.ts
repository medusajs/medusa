import { InputAlias } from "../../../definitions"
import { WorkflowArguments } from "../../../helper"

type GetShippingOptionPriceDTO = {
  option: any // Shipping Option
  data: any // Validated shipping option data
  config: {
    price: number | undefined
    cart: any
  } // Shipping option config e.g. cart
}

export async function getShippingOptionPrice({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: GetShippingOptionPriceDTO
}) {
  const { transactionManager: manager } = context

  const methodData = data[InputAlias.ValidatedShippingOptionData]
  const preparedData = data["preparedData"]

  const { shippingMethodConfig: config, option, cart } = preparedData

  let methodPrice
  if (typeof config.price === "number") {
    methodPrice = config.price
  } else {
    const shippingOptionService = container
      .resolve("shippingOptionService")
      .withTransaction(manager)

    methodPrice = await shippingOptionService.getPrice(option, methodData, cart)
  }

  return {
    shippingOptionPrice: methodPrice,
  }
}
