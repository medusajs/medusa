import { WorkflowArguments } from "../../helper"

export async function restoreShippingMethods({
  container,
  context,
  data,
}: WorkflowArguments<{
  deletedShippingMethods: any[]
}>) {
  const { manager } = context

  const { deletedShippingMethods } = data

  if (!deletedShippingMethods?.length) {
    return { restoredShippingMethods: [] }
  }

  const shippingOptionServiceTx = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  const restored = await shippingOptionServiceTx.restoreShippingMethods(
    deletedShippingMethods
  )

  return {
    restoredShippingMethods: restored,
  }
}

restoreShippingMethods.aliases = {
  deletedShippingMethods: "deletedShippingMethods",
}
