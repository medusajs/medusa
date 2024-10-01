import { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createShippingOptionsPriceSetsStep,
  upsertShippingOptionsStep,
} from "../steps"
import { setShippingOptionsPriceSetsStep } from "../steps/set-shipping-options-price-sets"
import { validateFulfillmentProvidersStep } from "../steps/validate-fulfillment-providers"
import { validateShippingOptionPricesStep } from "../steps/validate-shipping-option-prices"

export const createShippingOptionsWorkflowId =
  "create-shipping-options-workflow"
/**
 * This workflow creates one or more shipping options.
 */
export const createShippingOptionsWorkflow = createWorkflow(
  createShippingOptionsWorkflowId,
  (
    input: WorkflowData<
      FulfillmentWorkflow.CreateShippingOptionsWorkflowInput[]
    >
  ): WorkflowResponse<FulfillmentWorkflow.CreateShippingOptionsWorkflowOutput> => {
    parallelize(
      validateFulfillmentProvidersStep(input),
      validateShippingOptionPricesStep(input)
    )

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
        const shippingOptionsPrices = data.shippingOptionsIndexToPrices.map(
          ({ shipping_option_index, prices }) => {
            return {
              id: data.shippingOptions[shipping_option_index].id,
              prices,
            }
          }
        )

        return {
          shippingOptionsPrices,
        }
      }
    )

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
    return new WorkflowResponse(createdShippingOptions)
  }
)
