import { CartDTO, ShippingOptionDTO } from "@medusajs/types"
import { isDefined } from "medusa-core-utils"
import { StepExecutionContext, createStep } from "../../../../../utils/composer"

type InvokeInput = {
  shippingOption: ShippingOptionDTO
  shippingMethodData: Record<string, unknown>
  cart: CartDTO
}

type InvokeOutput = Record<string, unknown>

export const validateShippingOptionForCartStep = createStep(
  "validateShippingOptionForCartStep",
  async function (
    input: InvokeInput,
    executionContext: StepExecutionContext
  ): Promise<InvokeOutput> {
    const manager = executionContext.context.manager
    const container = executionContext.container

    const { shippingOption, shippingMethodData, cart } = input

    const fulfillmentProvider = container.resolve("fulfillmentProviderService")

    const shippingOptionService = container
      .resolve("shippingOptionService")
      .withTransaction(manager)

    if (isDefined(cart)) {
      await shippingOptionService.validateCartOption(shippingOption, cart)
    }

    const validatedShippingOptionData =
      await fulfillmentProvider.validateFulfillmentData(
        shippingOption,
        shippingMethodData,
        cart || {}
      )

    return validatedShippingOptionData
  }
)
