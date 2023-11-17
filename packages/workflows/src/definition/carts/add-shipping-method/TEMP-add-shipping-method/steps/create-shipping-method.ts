import { ShippingOptionService } from "../../../../../../../medusa/dist"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  shippingMethods: any
}

export const createShippingMethodsStep = createStep(
  "createShippingMethods",
  async function (input: InvokeInput, executionContext) {
    const manager = executionContext.context.manager
    const container = executionContext.container

    const { shippingMethods } = input

    const toCreate = Array.isArray(shippingMethods)
      ? shippingMethods
      : [shippingMethods]

    const shippingOptionService: ShippingOptionService = container
      .resolve("shippingOptionService")
      .withTransaction(manager)

    const createdMethods = await shippingOptionService.createShippingMethods(
      toCreate
    )

    return {
      shippingMethods: createdMethods,
      compensateInput: { shippingMethods },
    }
  },
  async function (input, executionContext) {
    const manager = executionContext.context.manager
    const container = executionContext.container
    const { shippingMethods } = input

    const shippingOptionServiceTx: ShippingOptionService = container
      .resolve("shippingOptionService")
      .withTransaction(manager)

    await shippingOptionServiceTx.deleteShippingMethods(shippingMethods)
  }
)
