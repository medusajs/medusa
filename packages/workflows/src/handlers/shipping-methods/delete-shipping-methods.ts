import { WorkflowArguments } from "../../helper"

export async function deleteShippingMethods({
  container,
  context,
  data,
}: WorkflowArguments<{
  shippingMethodsToDelete: any[]
  softDelete?: boolean
}>) {
  const { manager } = context
  const { shippingMethodsToDelete } = data

  const shippingOptionServiceTx = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  await shippingOptionServiceTx.deleteShippingMethods(shippingMethodsToDelete, {
    softDelete: data.softDelete ?? true,
  })

  return {
    deletedShippingMethods: shippingMethodsToDelete,
  }
}

deleteShippingMethods.aliases = {
  shippingMethodsToDelete: "shippingMethodsToDelete",
}
