import { CreateRuleTypeDTO, FulfillmentWorkflow } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import {
  createShippingOptionsPriceSetsStep,
  upsertShippingOptionsStep,
} from "../steps"
import { setShippingOptionsPriceSetsStep } from "../steps/set-shipping-options-price-sets"
import { createPricingRuleTypesStep } from "../../pricing"

export const createShippingOptionsWorkflowId =
  "create-shipping-options-workflow"
export const createShippingOptionsWorkflow = createWorkflow(
  createShippingOptionsWorkflowId,
  (
    input: WorkflowData<
      FulfillmentWorkflow.CreateShippingOptionsWorkflowInput[]
    >
  ): WorkflowData<FulfillmentWorkflow.CreateShippingOptionsWorkflowOutput> => {
    const data = transform(input, (data) => {
      const shippingOptionsIndexToPrices = data.map((option, index) => {
        const prices = option.prices
        return {
          shipping_option_index: index,
          prices,
        }
      })

      return {
        shippingOptions: data,
        shippingOptionsIndexToPrices,
      }
    })

    const createdShippingOptions = upsertShippingOptionsStep(
      data.shippingOptions
    )

    const normalizedShippingOptionsPrices = transform(
      {
        shippingOptions: createdShippingOptions,
        shippingOptionsIndexToPrices: data.shippingOptionsIndexToPrices,
      },
      (data) => {
        const ruleTypes = new Set<CreateRuleTypeDTO>()
        const shippingOptionsPrices = data.shippingOptionsIndexToPrices.map(
          ({ shipping_option_index, prices }) => {
            prices.forEach((price) => {
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
          ruleTypes: Array.from(ruleTypes) as CreateRuleTypeDTO[],
        }
      }
    )

    createPricingRuleTypesStep(normalizedShippingOptionsPrices.ruleTypes)

    const shippingOptionsPriceSetsLinkData = createShippingOptionsPriceSetsStep(
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
    )

    setShippingOptionsPriceSetsStep(normalizedLinkData)

    return createdShippingOptions
  }
)
