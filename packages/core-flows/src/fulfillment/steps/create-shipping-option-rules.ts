import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  AddFulfillmentShippingOptionRulesWorkflowDTO,
  IFulfillmentModuleService,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createShippingOptionRulesStepId = "create-shipping-option-rules"
export const createShippingOptionRulesStep = createStep(
  createShippingOptionRulesStepId,
  async (
    input: AddFulfillmentShippingOptionRulesWorkflowDTO,
    { container }
  ) => {
    const { data } = input

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const createdPromotionRules =
      await fulfillmentModule.createShippingOptionRules(data)

    return new StepResponse(
      createdPromotionRules,
      createdPromotionRules.map((pr) => pr.id)
    )
  },
  async (ruleIds, { container }) => {
    if (!ruleIds?.length) {
      return
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await fulfillmentModule.deleteShippingOptionRules(ruleIds)
  }
)
