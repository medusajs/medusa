import { CartDTO, ShippingOptionDTO } from "@medusajs/types"
import { StepExecutionContext, createStep } from "../../../../../utils/composer"

type InvokeInput = {
  shippingOption: ShippingOptionDTO
  shippingMethodData: Record<string, unknown>
  shippingMethodConfig: { cart_id?: string; price?: number; cart?: CartDTO }
}

type InvokeOutput = {
  price: number
}

export const getShippingOptionPriceStep = createStep(
  "getShippingOptionPrice",
  async function (
    input: InvokeInput,
    executionContext: StepExecutionContext
  ): Promise<InvokeOutput> {
    const manager = executionContext.context.manager
    const container = executionContext.container

    const { shippingOption, shippingMethodData, shippingMethodConfig } = input

    const shippingOptionService = container
      .resolve("shippingOptionService")
      .withTransaction(manager)

    const methodPrice = await shippingOptionService.getPrice(
      shippingOption,
      shippingMethodData,
      shippingMethodConfig
    )

    return { price: methodPrice }
  }
)
