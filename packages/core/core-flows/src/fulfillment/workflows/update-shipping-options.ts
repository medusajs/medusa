import { FulfillmentWorkflow } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import {
  setShippingOptionsPricesStep,
  upsertShippingOptionsStep,
} from "../steps"
import { validateFulfillmentProvidersStep } from "../steps/validate-fulfillment-providers"

export const updateShippingOptionsWorkflowId =
  "update-shipping-options-workflow"
export const updateShippingOptionsWorkflow = createWorkflow(
  updateShippingOptionsWorkflowId,
  (
    input: WorkflowData<
      FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput[]
    >
  ): WorkflowResponse<FulfillmentWorkflow.UpdateShippingOptionsWorkflowOutput> => {
    validateFulfillmentProvidersStep(input)

    const data = transform(input, (data) => {
      const shippingOptionsIndexToPrices = data.map((option, index) => {
        const prices = option.prices
        delete option.prices
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

    const updatedShippingOptions = upsertShippingOptionsStep(
      data.shippingOptions
    )

    const normalizedShippingOptionsPrices = transform(
      {
        shippingOptions: updatedShippingOptions,
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

    setShippingOptionsPricesStep(
      normalizedShippingOptionsPrices.shippingOptionsPrices
    )

    return new WorkflowResponse(updatedShippingOptions)
  }
)
