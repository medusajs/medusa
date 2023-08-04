import { WorkflowArguments } from "../../../helper"

export async function cleanUpShippingMethods({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    cart: any
  }
  createdShippingMethods: any[]
}>) {
  const { transactionManager: manager } = context

  const { cart } = data.input
  const { createdShippingMethods } = data

  const deletedShippingMethods: any = []

  if (!cart.shipping_methods?.length) {
    return []
  }

  const shippingOptionServiceTx = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  for (const shippingMethod of cart.shipping_methods) {
    if (
      createdShippingMethods.some(
        (m) =>
          m.shipping_option.profile_id ===
          shippingMethod.shipping_option.profile_id
      )
    ) {
      await shippingOptionServiceTx.deleteShippingMethods(shippingMethod)
      deletedShippingMethods.push(shippingMethod)
    }
  }

  return {
    deletedShippingMethods,
  }
}

cleanUpShippingMethods.aliases = {
  input: "input",
  createdShippingMethods: "createdShippingMethods",
}
