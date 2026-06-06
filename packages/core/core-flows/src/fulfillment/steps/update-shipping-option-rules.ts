import {
  IFulfillmentModuleService,
  UpdateFulfillmentShippingOptionRulesWorkflowDTO,
  UpdateShippingOptionRuleDTO,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const updateShippingOptionRulesStepId = "update-shipping-option-rules"
/**
 * This step updates one or more shipping option rules.
 * 
 * @example
 * const data = updateShippingOptionRulesStep({
 *   data: [
 *     {
 *       id: "sor_123",
 *       operator: "in"
 *     }
 *   ]
 * })
 */
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
      Modules.FULFILLMENT
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
      Modules.FULFILLMENT
    )

    await fulfillmentModule.updateShippingOptionRules(previousRulesData)
  }
)
