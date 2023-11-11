import { ShippingMethodDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../../../../helper"
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

async function invoke({
  container,
  context,
  data,
}: WorkflowArguments<InvokeInput>): Promise<InvokeOutput> {
  const { manager } = context
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

async function compensate({
  container,
  context,
  data, // compensationData
}: WorkflowArguments<CompensateInput>): Promise<CompensateOutput> {
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
