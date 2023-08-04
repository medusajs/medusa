import { WorkflowArguments } from "../../../helper"

export async function restoreShippingMethods({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    cart: any
  }
  deletedShippingMethods: any[]
}>) {
  const { manager } = context

  const { cart } = data.input
  const { deletedShippingMethods } = data

  if (deletedShippingMethods?.length) {
    return []
  }

  const shippingOptionServiceTx = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const toCreate = deletedShippingMethods.map((method) => ({
    id: method.id,
    option: method.option,
    data: method.data,
    price: method.price,
    // config: shippingMethodConfig,
  }))

  const createdMethods = await shippingOptionServiceTx.createdShippingMethods(
    toCreate
  )

  return {
    createdMethods,
  }
}

restoreShippingMethods.aliases = {
  input: "input",
  deletedShippingMethods: "deletedShippingMethods",
}
