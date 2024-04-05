import { FulfillmentWorkflow } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { createShippingOptionsStep } from "../steps/create-shipping-options"
import { setShippingOptionsPricesStep } from "../steps/set-shipping-options-prices"

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

    const createdShippingOptions = createShippingOptionsStep(
      data.shippingOptions
    )

    const normalizedShippingOptionsPrices = transform(
      {
        shippingOptions: createdShippingOptions,
        shippingOptionsIndexToPrices: data.shippingOptionsIndexToPrices,
      },
      (data) => {
        return data.shippingOptionsIndexToPrices.map(
          ({ shipping_option_index, prices }) => {
            return {
              id: data.shippingOptions[shipping_option_index].id,
              prices,
            }
          }
        )
      }
    )

    setShippingOptionsPricesStep({ input: normalizedShippingOptionsPrices })

    return createdShippingOptions
  }
)
