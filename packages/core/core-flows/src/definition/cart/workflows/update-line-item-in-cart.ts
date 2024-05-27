import { UpdateLineItemInCartWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import { updateLineItemsStepWithSelector } from "../../line-item/steps"
import { refreshCartShippingMethodsStep } from "../steps"
import { refreshCartPromotionsStep } from "../steps/refresh-cart-promotions"
import { validateVariantPricesStep } from "../steps/validate-variant-prices"
import {
  cartFieldsForRefreshSteps,
  productVariantsFields,
} from "../utils/fields"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"
import { refreshPaymentCollectionForCartStep } from "./refresh-payment-collection"

// TODO: The UpdateLineItemsWorkflow are missing the following steps:
// - Validate shipping methods for new items (fulfillment module)

export const updateLineItemInCartWorkflowId = "update-line-item-in-cart"
export const updateLineItemInCartWorkflow = createWorkflow(
  updateLineItemInCartWorkflowId,
  (input: WorkflowData<UpdateLineItemInCartWorkflowInputDTO>) => {
    const variantIds = transform({ input }, (data) => {
      return [data.input.item.variant_id]
    })

    // TODO: This is on par with the context used in v1.*, but we can be more flexible.
    const pricingContext = transform({ cart: input.cart }, (data) => {
      return {
        currency_code: data.cart.currency_code,
        region_id: data.cart.region_id,
        customer_id: data.cart.customer_id,
      }
    })

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
    })

    validateVariantPricesStep({ variants })

    const items = transform({ input }, (data) => {
      return [data.input.item]
    })

    confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id: input.cart.sales_channel_id as string,
        variants,
        items,
      },
    })

    const lineItemUpdate = transform({ input, variants }, (data) => {
      const variant = data.variants[0]
      const item = data.input.item

      return {
        data: {
          ...data.input.update,
          unit_price: variant.calculated_price.calculated_amount,
        },
        selector: {
          id: item.id,
        },
      }
    })

    const result = updateLineItemsStepWithSelector(lineItemUpdate)

    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: cartFieldsForRefreshSteps,
      variables: { id: input.cart.id },
      list: false,
    }).config({ name: "refetch–cart" })

    refreshCartShippingMethodsStep({ cart })
    refreshCartPromotionsStep({ id: input.cart.id })
    refreshPaymentCollectionForCartStep({ cart_id: input.cart.id })

    const updatedItem = transform({ result }, (data) => data.result?.[0])

    return updatedItem
  }
)
