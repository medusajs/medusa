import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import { addShippingMethodToCartStep } from "../steps"
import { getShippingOptionPriceSetsStep } from "../steps/get-shipping-option-price-sets"
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

    const priceSets = getShippingOptionPriceSetsStep({
      optionIds: optionIds,
      context: { currency_code: input.currency_code },
    })

    const shippingOptions = useRemoteQueryStep({
      entry_point: "shipping_option",
      fields: ["id", "name"],
      variables: {
        id: optionIds,
      },
    })

    const shippingMethodInput = transform(
      { priceSets, input, shippingOptions },
      (data) => {
        const options = (data.input.options ?? []).map((option) => {
          const shippingOption = data.shippingOptions.find(
            (so) => so.id === option.id
          )!

          const price = data.priceSets[option.id].calculated_amount

          return {
            shipping_option_id: shippingOption.id,
            amount: price,
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
