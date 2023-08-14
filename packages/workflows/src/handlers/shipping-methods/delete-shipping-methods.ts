import { ShippingMethodDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  shippingMethodsToDelete: ShippingMethodDTO[]
  softDelete?: boolean
}

type HandlerOutput = {
  deletedShippingMethods: ShippingMethodDTO[]
}

export async function deleteShippingMethods({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<HandlerOutput> {
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
