import { FulfillmentWorkflow } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { upsertShippingOptionsStep } from "../steps"

export const updateShippingOptionsWorkflowId =
  "update-shipping-options-workflow"
export const updateShippingOptionsWorkflow = createWorkflow(
  updateShippingOptionsWorkflowId,
  (
    input: WorkflowData<
      FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput[]
    >
  ): WorkflowData<FulfillmentWorkflow.UpdateShippingOptionsWorkflowOutput> => {
    const data = transform(input, (data) => {
      const shippingOptionsIndexToPrices = data.map((option, index) => {
        return {
          shipping_option_index: index,
          prices: option.prices,
        }
      })

      return {
        shippingOptions: data,
        shippingOptionsIndexToPrices,
      }
    })

    const updatedShippingOptions = upsertShippingOptionsStep(
      data.shippingOptions
    )

    /*const normalizedShippingOptionsPrices = transform(
      {
        shippingOptions: updatedShippingOptions,
        shippingOptionsIndexToPrices: data.shippingOptionsIndexToPrices,
      },
      (data) => {
        const ruleTypes = new Set<Partial<RuleTypeDTO>>()
        const shippingOptionsPrices = data.shippingOptionsIndexToPrices.map(
          ({ shipping_option_index, prices }) => {
            prices?.forEach((price) => {
              if ("region_id" in price) {
                ruleTypes.add({
                  name: "region_id",
                  rule_attribute: "region_id",
                })
              }
            })

            return {
              id: data.shippingOptions[shipping_option_index].id,
              prices,
            }
          }
        )

        return {
          shippingOptionsPrices,
          ruleTypes: Array.from(ruleTypes) as UpdateRuleTypeDTO[],
        }
      }
    )*/

    /*updatePricingRuleTypesStep(normalizedShippingOptionsPrices.ruleTypes)*/

    /*const shippingOptionsPriceSetsLinkData = updateShippingOptionsPriceSetsStep(
      normalizedShippingOptionsPrices.shippingOptionsPrices
    )

    const normalizedLinkData = transform(
      {
        shippingOptionsPriceSetsLinkData,
      },
      (data) => {
        return data.shippingOptionsPriceSetsLinkData.map((item) => {
          return {
            id: item.id,
            price_sets: [item.priceSetId],
          }
        })
      }
    )*/

    /*setShippingOptionsPriceSetsStep(normalizedLinkData)*/

    return updatedShippingOptions
  }
)
