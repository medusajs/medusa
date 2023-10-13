import { CartDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../../helper"

type PreparationHandlerInput = {
  cart: CartDTO & { shipping_methods: any[] }
  shippingMethods: any[]
}

export async function prepareDeleteShippingMethodsData({
  data,
}: WorkflowArguments<PreparationHandlerInput>) {
  const { cart, shippingMethods } = data

  if (!cart.shipping_methods?.length) {
    return []
  }

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
