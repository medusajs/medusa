import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import {
  addShippingMethodToCartStep,
  validateCartShippingOptionsStep,
} from "../steps"
import { getShippingOptionPriceSetsStep } from "../steps/get-shipping-option-price-sets"
import { refreshCartPromotionsStep } from "../steps/refresh-cart-promotions"
import { updateTaxLinesStep } from "../steps/update-tax-lines"

interface AddShippingMethodToCartWorkflowInput {
  cart_id: string
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
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: [
        "region_id",
        "currency_code",
        "items.*",
        "shipping_address.*",
        "shipping_methods.*",
      ],
      variables: { id: input.cart_id },
      list: false,
    })

    const optionIds = transform({ input }, (data) => {
      return (data.input.options ?? []).map((i) => i.id)
    })

    validateCartShippingOptionsStep({
      option_ids: optionIds,
      cart,
    })

    const priceSets = getShippingOptionPriceSetsStep({
      optionIds: optionIds,
      context: { currency_code: cart.currency_code },
    })

    const shippingOptions = useRemoteQueryStep({
      entry_point: "shipping_option",
      fields: ["id", "name"],
      variables: { id: optionIds },
    }).config({ name: "shipping-options" })

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
