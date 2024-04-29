import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import { addShippingMethodToCartStep } from "../steps"
import { refreshCartPromotionsStep } from "../steps/refresh-cart-promotions"
import { updateTaxLinesStep } from "../steps/update-tax-lines"

interface AddShippingMethodToCartWorkflowInput {
  cart_id: string
  currency_code: string
  options: {
    id: string
    data?: Record<string, unknown>
  }[]
}

export const addShippingMethodToCartWorkflowId = "add-shipping-method-to-cart"
export const addShippingMethodToWorkflow = createWorkflow(
  addShippingMethodToCartWorkflowId,
  (
    input: WorkflowData<AddShippingMethodToCartWorkflowInput>
  ): WorkflowData<void> => {
    const optionIds = transform({ input }, (data) => {
      return (data.input.options ?? []).map((i) => i.id)
    })

    const shippingOptions = useRemoteQueryStep({
      entry_point: "shipping_option",
      fields: ["id", "name", "calculated_price.calculated_amount"],
      variables: {
        id: optionIds,
        calculated_price: {
          context: {
            currency_code: input.currency_code,
          },
        },
      },
    })

    const shippingMethodInput = transform(
      { input, shippingOptions },
      (data) => {
        const options = (data.input.options ?? []).map((option) => {
          const shippingOption = data.shippingOptions.find(
            (so) => so.id === option.id
          )!

          return {
            shipping_option_id: shippingOption.id,
            amount: shippingOption.calculated_price.calculated_amount,
            data: option.data ?? {},
            name: shippingOption.name,
            cart_id: data.input.cart_id,
          }
        })

        return options
      }
    )

    const shippingMethods = addShippingMethodToCartStep({
      shipping_methods: shippingMethodInput,
    })
    refreshCartPromotionsStep({ id: input.cart_id })
    updateTaxLinesStep({
      cart_or_cart_id: input.cart_id,
      shipping_methods: shippingMethods,
    })
  }
)
