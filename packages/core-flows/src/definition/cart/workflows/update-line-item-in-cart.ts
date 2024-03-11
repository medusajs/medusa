import { UpdateLineItemInCartWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { updateLineItemsStep } from "../../line-item/steps"
import { getVariantPriceSetsStep } from "../steps"
import { refreshCartPromotionsStep } from "../steps/refresh-cart-promotions"
import { refreshPaymentCollectionForCartStep } from "./refresh-payment-collection"

// TODO: The UpdateLineItemsWorkflow are missing the following steps:
// - Confirm inventory exists (inventory module)
// - Validate shipping methods for new items (fulfillment module)
// - Refresh line item adjustments (promotion module)
// - Update payment sessions (payment module)

export const updateLineItemInCartWorkflowId = "update-line-item-in-cart"
export const updateLineItemInCartWorkflow = createWorkflow(
  updateLineItemInCartWorkflowId,
  (input: WorkflowData<UpdateLineItemInCartWorkflowInputDTO>) => {
    const item = transform({ input }, (data) => data.input.item)

    const pricingContext = transform({ cart: input.cart, item }, (data) => {
      return {
        currency_code: data.cart.currency_code,
        region_id: data.cart.region_id,
        customer_id: data.cart.customer_id,
      }
    })

    const variantIds = transform({ input }, (data) => [
      data.input.item.variant_id!,
    ])

    const priceSets = getVariantPriceSetsStep({
      variantIds,
      context: pricingContext,
    })

    const lineItemUpdate = transform({ input, priceSets, item }, (data) => {
      const price = data.priceSets[data.item.variant_id!].calculated_amount

      return {
        data: {
          ...data.input.update,
          unit_price: price,
        },
        selector: {
          id: data.input.item.id,
        },
      }
    })

    const result = updateLineItemsStep({
      data: lineItemUpdate.data,
      selector: lineItemUpdate.selector,
    })

    refreshCartPromotionsStep({ id: input.cart.id })
    refreshPaymentCollectionForCartStep({
      cart_id: input.cart.id,
    })

    const updatedItem = transform({ result }, (data) => data.result?.[0])

    return updatedItem
  }
)
