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

  let methodPrice
  if (typeof data.config.price === "number") {
    methodPrice = data.config.price
  } else {
    const shippingOptionService = container
      .resolve("shippingOptionService")
      .withTransaction(manager)

    methodPrice = await shippingOptionService.getPrice(
      data.option,
      data.data,
      data.config.cart
    )
  }

  return {
    alias: "shippingOptionPrice",
    value: methodPrice,
  }
}
