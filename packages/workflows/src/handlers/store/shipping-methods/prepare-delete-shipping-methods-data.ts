import { WorkflowArguments } from "../../../helper"

export async function prepareDeleteShippingMethodsData({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    cart: any
  }
  shippingMethods: any[]
}>) {
  const { input, shippingMethods } = data
  const { cart } = input

  if (!cart.shipping_methods?.length) {
    return []
  }

  console.log("Before delte", shippingMethods)

  const toDelete: any[] = []

  for (const method of cart.shipping_methods) {
    if (
      shippingMethods.some(
        (m) =>
          m.shipping_option.profile_id === method.shipping_option.profile_id
      )
    ) {
      toDelete.push(method)
    }
  }

  return {
    alias: "shippingMethodsToDelete",
    value: toDelete,
  }
}
