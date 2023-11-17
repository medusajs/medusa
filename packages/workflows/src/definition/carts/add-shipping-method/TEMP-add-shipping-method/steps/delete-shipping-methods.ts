import { ShippingMethodDTO } from "@medusajs/types"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = ShippingMethodDTO[]

type InvokeOutput = {
  deletedShippingMethods: ShippingMethodDTO[]
  compensateInput: {
    deletedShippingMethods: ShippingMethodDTO[]
  }
}

export const deleteShippingMethodsStep = createStep(
  "deleteShippingMethodsStep",
  async function (input: InvokeInput, executionContext): Promise<InvokeOutput> {
    const manager = executionContext.context.manager
    const container = executionContext.container

    const shippingOptionServiceTx = container
      .resolve("shippingOptionService")
      .withTransaction(manager)

    await shippingOptionServiceTx.deleteShippingMethods(input)

    return {
      deletedShippingMethods: input,
      compensateInput: {
        deletedShippingMethods: input,
      },
    }
  },
  async function (input, executionContext): Promise<void> {
    const manager = executionContext.context.manager
    const container = executionContext.container

    const { deletedShippingMethods } = input

    const shippingOptionServiceTx = container
      .resolve("shippingOptionService")
      .withTransaction(manager)

    await shippingOptionServiceTx.restoreShippingMethods(deletedShippingMethods)
  }
)
