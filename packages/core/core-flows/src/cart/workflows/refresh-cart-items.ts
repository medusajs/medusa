import { isDefined, PromotionActions } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common/steps/use-remote-query"
import { refreshCartShippingMethodsStep, updateLineItemsStep } from "../steps"
import { validateVariantPricesStep } from "../steps/validate-variant-prices"
import {
  cartFieldsForRefreshSteps,
  productVariantsFields,
} from "../utils/fields"
import { prepareLineItemData } from "../utils/prepare-line-item-data"
import { refreshPaymentCollectionForCartWorkflow } from "./refresh-payment-collection"
import { updateCartPromotionsWorkflow } from "./update-cart-promotions"
import { updateTaxLinesWorkflow } from "./update-tax-lines"

export const refreshCartItemsWorkflowId = "refresh-cart-items"
/**
 * This workflow refreshes a cart's items
 */
export const refreshCartItemsWorkflow = createWorkflow(
  refreshCartItemsWorkflowId,
  (
    input: WorkflowData<{
      cart_id: string
      promo_codes?: string[]
    }>
  ) => {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: cartFieldsForRefreshSteps,
      variables: { id: input.cart_id },
      list: false,
    })

    const variantIds = transform({ cart }, (data) => {
      return (data.cart.items ?? []).map((i) => i.variant_id)
    })

    const pricingContext = transform(
      { cart },
      ({ cart: { currency_code, region_id, customer_id } }) => {
        return {
          currency_code,
          region_id,
          customer_id,
        }
      }
    )

    const variants = useRemoteQueryStep({
      entry_point: "variants",
      fields: productVariantsFields,
      variables: {
        id: variantIds,
        calculated_price: {
          context: pricingContext,
        },
      },
      throw_if_key_not_found: true,
    }).config({ name: "fetch-variants" })

    validateVariantPricesStep({ variants })

    const lineItems = transform({ cart, variants }, ({ cart, variants }) => {
      const items = cart.items.map((item) => {
        const variant = variants.find((v) => v.id === item.variant_id)!

        const preparedItem = prepareLineItemData({
          variant: variant,
          unitPrice: variant.calculated_price.calculated_amount,
          isTaxInclusive:
            variant.calculated_price.is_calculated_price_tax_inclusive,
          quantity: item.quantity,
          metadata: item.metadata,
          cartId: cart.id,
        })

        return {
          selector: { id: item.id },
          data: preparedItem,
        }
      })

      return items
    })

    const items = updateLineItemsStep({
      id: cart.id,
      items: lineItems,
    })

    const refetchedCart = useRemoteQueryStep({
      entry_point: "cart",
      fields: cartFieldsForRefreshSteps,
      variables: { id: cart.id },
      list: false,
    }).config({ name: "refetch–cart" })

    refreshCartShippingMethodsStep({ cart: refetchedCart })

    updateTaxLinesWorkflow.runAsStep({
      input: { cart_id: cart.id, items },
    })

    const cartPromoCodes = transform({ cart, input }, ({ cart, input }) => {
      if (isDefined(input.promo_codes)) {
        return input.promo_codes
      } else {
        return cart.promotions.map((p) => p.code)
      }
    })

    updateCartPromotionsWorkflow.runAsStep({
      input: {
        cart_id: cart.id,
        promo_codes: cartPromoCodes,
        action: PromotionActions.REPLACE,
      },
    })

    refreshPaymentCollectionForCartWorkflow.runAsStep({
      input: { cart_id: cart.id },
    })

    return new WorkflowResponse(refetchedCart)
  }
)
