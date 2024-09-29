import { MedusaError } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common/steps/use-remote-query"
import {
  addShippingMethodToCartStep,
  removeShippingMethodFromCartStep,
  validateCartShippingOptionsStep,
} from "../steps"
import { validateCartStep } from "../steps/validate-cart"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { updateCartPromotionsWorkflow } from "./update-cart-promotions"
import { updateTaxLinesWorkflow } from "./update-tax-lines"

export interface AddShippingMethodToCartWorkflowInput {
  cart_id: string
  options: {
    id: string
    data?: Record<string, unknown>
  }[]
}

export const addShippingMethodToCartWorkflowId = "add-shipping-method-to-cart"
/**
 * This workflow adds shipping methods to a cart.
 */
export const addShippingMethodToWorkflow = createWorkflow(
  addShippingMethodToCartWorkflowId,
  (
    input: WorkflowData<AddShippingMethodToCartWorkflowInput>
  ): WorkflowData<void> => {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: cartFieldsForRefreshSteps,
      variables: { id: input.cart_id },
      list: false,
    })

    validateCartStep({ cart })

    const optionIds = transform({ input }, (data) => {
      return (data.input.options ?? []).map((i) => i.id)
    })

    validateCartShippingOptionsStep({
      option_ids: optionIds,
      cart,
      shippingOptionsContext: { is_return: "false", enabled_in_store: "true" },
    })

    const shippingOptions = useRemoteQueryStep({
      entry_point: "shipping_option",
      fields: [
        "id",
        "name",
        "calculated_price.calculated_amount",
        "calculated_price.is_calculated_price_tax_inclusive",
      ],
      variables: {
        id: optionIds,
        calculated_price: {
          context: { currency_code: cart.currency_code },
        },
      },
    }).config({ name: "fetch-shipping-option" })

    const shippingMethodInput = transform(
      { input, shippingOptions },
      (data) => {
        const options = (data.input.options ?? []).map((option) => {
          const shippingOption = data.shippingOptions.find(
            (so) => so.id === option.id
          )!

          if (!shippingOption?.calculated_price) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Shipping option with ID ${shippingOption.id} do not have a price`
            )
          }

          return {
            shipping_option_id: shippingOption.id,
            amount: shippingOption.calculated_price.calculated_amount,
            is_tax_inclusive:
              !!shippingOption.calculated_price
                .is_calculated_price_tax_inclusive,
            data: option.data ?? {},
            name: shippingOption.name,
            cart_id: data.input.cart_id,
          }
        })

        return options
      }
    )

    const currentShippingMethods = transform({ cart }, ({ cart }) => {
      return cart.shipping_methods.map((sm) => sm.id)
    })

    removeShippingMethodFromCartStep({
      shipping_method_ids: currentShippingMethods,
    })

    const shippingMethodsToAdd = addShippingMethodToCartStep({
      shipping_methods: shippingMethodInput,
    })

    updateTaxLinesWorkflow.runAsStep({
      input: {
        cartId: input.cart_id,
        shippingMethods: shippingMethodsToAdd,
      },
    })

    updateCartPromotionsWorkflow.runAsStep({
      input: {
        cart_id: input.cart_id,
      },
    })
  }
)
