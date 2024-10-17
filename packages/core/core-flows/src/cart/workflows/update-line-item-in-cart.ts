import { UpdateLineItemInCartWorkflowInputDTO } from "@medusajs/framework/types"
import { CartWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { useRemoteQueryStep } from "../../common/steps/use-remote-query"
import { updateLineItemsStepWithSelector } from "../../line-item/steps"
import { refreshCartShippingMethodsStep } from "../steps"
import { validateCartStep } from "../steps/validate-cart"
import { validateVariantPricesStep } from "../steps/validate-variant-prices"
import {
  cartFieldsForRefreshSteps,
  productVariantsFields,
} from "../utils/fields"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"
import { refreshPaymentCollectionForCartWorkflow } from "./refresh-payment-collection"
import { updateCartPromotionsWorkflow } from "./update-cart-promotions"

// TODO: The UpdateLineItemsWorkflow are missing the following steps:
// - Validate shipping methods for new items (fulfillment module)

export const updateLineItemInCartWorkflowId = "update-line-item-in-cart"
/**
 * This workflow updates a cart's line item.
 */
export const updateLineItemInCartWorkflow = createWorkflow(
  updateLineItemInCartWorkflowId,
  (input: WorkflowData<UpdateLineItemInCartWorkflowInputDTO>) => {
    validateCartStep(input)

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
          is_tax_inclusive:
            !!variant.calculated_price.is_calculated_price_tax_inclusive,
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

    updateCartPromotionsWorkflow.runAsStep({
      input: {
        cart_id: input.cart.id,
      },
    })

    parallelize(
      refreshPaymentCollectionForCartWorkflow.runAsStep({
        input: { cart_id: input.cart.id },
      }),
      emitEventStep({
        eventName: CartWorkflowEvents.UPDATED,
        data: { id: input.cart.id },
      })
    )

    const updatedItem = transform({ result }, (data) => data.result?.[0])

    return new WorkflowResponse(updatedItem)
  }
)
