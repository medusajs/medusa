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

  const { deletedShippingMethods } = data

  if (deletedShippingMethods?.length) {
    return []
  }

  const shippingOptionServiceTx = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const toCreate = deletedShippingMethods.map((method) => {
    const config = {
      ...method,
    }
    return {
      option: method.shipping_option,
      data: method.data,
      price: method.price,
      config,
    }
  })

  const createdMethods = await shippingOptionServiceTx.createShippingMethods(
    toCreate
  )

  return {
    restoredShippingMethods: createdMethods,
  }
}

restoreShippingMethods.aliases = {
  input: "input",
  deletedShippingMethods: "deletedShippingMethods",
}
