import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import {
  FulfillmentWorkflow,
  IFulfillmentModuleService,
  ShippingOptionDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

type StepInput = Omit<
  FulfillmentWorkflow.CreateShippingOptionsWorkflowInput,
  "prices"
>[]

type StepOutput = {
  id: string
}[]

export const createShippingOptionsStepId = "create-shipping-options-step"
export const createShippingOptionsStep = createStep(
  createShippingOptionsStepId,
  async (input: StepInput, { container }) => {
    if (!input?.length) {
      return new StepResponse([] as StepOutput, [])
    }

    const fulfillmentService = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )
    const createdShippingOptions: ShippingOptionDTO[] =
      await fulfillmentService.createShippingOptions(input)

    const shippingOptionIds = createdShippingOptions.map((s) => s.id)

    return new StepResponse(
      createdShippingOptions as StepOutput,
      shippingOptionIds
    )
  },
  async (shippingOptionIds, { container }) => {
    if (!shippingOptionIds?.length) {
      return
    }

    const fulfillmentService = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await fulfillmentService.deleteShippingOptions(shippingOptionIds)
  }
)
