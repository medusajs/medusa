import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IFulfillmentModuleService,
  RemoveFulfillmentShippingOptionRulesWorkflowDTO,
  RuleOperatorType,
} from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteShippingOptionRulesStepId = "delete-shipping-option-rules"
export const deleteShippingOptionRulesStep = createStep(
  deleteShippingOptionRulesStepId,
  async (
    input: RemoveFulfillmentShippingOptionRulesWorkflowDTO,
    { container }
  ) => {
    if (!input.ids?.length) {
      return
    }

    const { ids } = input

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const shippingOptionRules = await fulfillmentModule.listShippingOptionRules(
      { id: ids },
      { select: ["attribute", "operator", "value", "shipping_option_id"] }
    )

    await fulfillmentModule.deleteShippingOptionRules(ids)

    return new StepResponse(null, shippingOptionRules)
  },
  async (shippingOptionRules, { container }) => {
    if (!shippingOptionRules?.length) {
      return
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await fulfillmentModule.createShippingOptionRules(
      shippingOptionRules.map((rule) => ({
        id: rule.id,
        attribute: rule.attribute,
        operator: rule.operator as RuleOperatorType,
        value: rule.value as unknown as string | string[],
        shipping_option_id: rule.shipping_option_id,
      }))
    )
  }
)
