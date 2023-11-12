import { ShippingMethodDTO } from "@medusajs/types"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  shippingMethodsToDelete: ShippingMethodDTO[]
}

type InvokeOutput = {
  deletedShippingMethods: ShippingMethodDTO[]
  compensationData: {
    deletedShippingMethods: ShippingMethodDTO[]
  }
}

type CompensateInput = {
  deletedShippingMethods: ShippingMethodDTO[]
}

type CompensateOutput = void

async function invoke(input, data): Promise<InvokeOutput> {
  const { manager, container } = input
  const { shippingMethodsToDelete } = data

  const shippingOptionServiceTx = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  await shippingOptionServiceTx.deleteShippingMethods(shippingMethodsToDelete)

  return {
    deletedShippingMethods: shippingMethodsToDelete,
    compensationData: {
      deletedShippingMethods: shippingMethodsToDelete,
    },
  }
}

async function compensate(
  input,
  data // compensationData
): Promise<CompensateOutput> {
  const { container, context } = input
  const { manager } = context

  const { deletedShippingMethods } = data

  const shippingOptionServiceTx = container
    .resolve("shippingOptionService")
    .withTransaction(manager)

  await shippingOptionServiceTx.restoreShippingMethods(deletedShippingMethods)
}

export const deleteShippingMethodsStep = createStep(
  "deleteShippingMethodsStep",
  invoke,
  compensate
)
