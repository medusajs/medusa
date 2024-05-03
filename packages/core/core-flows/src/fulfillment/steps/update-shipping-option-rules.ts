import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IFulfillmentModuleService,
  UpdateFulfillmentShippingOptionRulesWorkflowDTO,
  UpdateShippingOptionRuleDTO,
} from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const updateShippingOptionRulesStepId = "update-shipping-option-rules"
export const updateShippingOptionRulesStep = createStep(
  updateShippingOptionRulesStepId,
  async (
    input: UpdateFulfillmentShippingOptionRulesWorkflowDTO,
    { container }
  ) => {
    if (!input.data?.length) {
      return
    }

    const { data } = input

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const ids = data.map((d) => d.id)
    const shippingOptionRules = await fulfillmentModule.listShippingOptionRules(
      { id: ids },
      { select: ["id", "attribute", "operator", "value", "shipping_option_id"] }
    )

    const updatedPromotionRules =
      await fulfillmentModule.updateShippingOptionRules(data)

    return new StepResponse(
      updatedPromotionRules,
      shippingOptionRules as unknown as UpdateShippingOptionRuleDTO[]
    )
  },
  async (previousRulesData, { container }) => {
    if (!previousRulesData?.length) {
      return
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await fulfillmentModule.updateShippingOptionRules(previousRulesData)
  }
)
