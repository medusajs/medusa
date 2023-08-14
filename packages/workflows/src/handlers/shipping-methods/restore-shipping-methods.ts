import { ShippingMethodDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  deletedShippingMethods: ShippingMethodDTO[]
}

type HandlerOutput = {
  restoredShippingMethods: ShippingMethodDTO[]
}

export async function restoreShippingMethods({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<HandlerOutput> {
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
