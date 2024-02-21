import {
  AddToCartWorkflowInputDTO,
  CreateLineItemForCartDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { getVariantPriceSetsStep, validateVariantsExistStep } from "../steps"
import { addToCartStep } from "../steps/add-to-cart"
import { prepareLineItemData } from "../utils/prepare-line-item-data"

export const addToCartWorkflowId = "add-to-cart"
export const addToCartWorkflow = createWorkflow(
  addToCartWorkflowId,
  (input: WorkflowData<AddToCartWorkflowInputDTO>) => {
    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? []).map((i) => i.variant_id)
    })

    const variants = validateVariantsExistStep({ variantIds })

    const pricingContext = transform({ cart: input.cart }, (data) => {
      return {
        currency_code: data.cart.currency_code,
        region_id: data.cart.region_id,
      }
    })

    const priceSets = getVariantPriceSetsStep({
      variantIds,
      context: pricingContext,
    })

    const lineItems = transform(
      { priceSets, input, variants, cart: input.cart },
      (data) => {
        const items = (data.input.items ?? []).map((item) => {
          const variant = data.variants[item.variant_id]

          return prepareLineItemData({
            variant: variant,
            unitPrice: data.priceSets[item.variant_id].calculated_amount,
            quantity: item.quantity,
            metadata: item?.metadata ?? {},
            cartId: data.cart.id,
          }) as CreateLineItemForCartDTO
        })

        return items
      }
    )

    const items = addToCartStep({ items: lineItems })

    return items
  }
)
