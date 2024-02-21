import { CartDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { getVariantPriceSetsStep, validateVariantsExistStep } from "../steps"
import { addToCartStep } from "../steps/add-to-cart"
import { getCartsStep } from "../steps/get-cart"
import { prepareLineItemData } from "../utils/prepare-line-item-data"

interface Item {
  variant_id: string
  quantity: number
  metadata?: Record<string, unknown> | undefined
}

export interface AddToCartWorkflowInputDTO {
  items: Item[]
  cartIds: string[]
}

export const addToCartWorkflowId = "add-to-cart"
export const addToCartWorkflow = createWorkflow(
  addToCartWorkflowId,
  (input: WorkflowData<AddToCartWorkflowInputDTO>): WorkflowData<CartDTO> => {
    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? []).map((i) => i.variant_id)
    })

    const variants = validateVariantsExistStep({ variantIds })

    const carts = getCartsStep({ cartIds: input.cartIds })

    const cart = transform({ carts }, (data) => {
      return data.carts[0]
    })

    const priceSets = getVariantPriceSetsStep({
      variantIds,
      regionId: cart.region_id,
      currencyCode: cart.currency_code,
    })

    const lineItems = transform(
      { priceSets, input, variants, cart },
      (data) => {
        const items = (data.input.items ?? []).map((item) => {
          const variant = data.variants[item.variant_id]

          return prepareLineItemData({
            variant: variant,
            unitPrice: data.priceSets[item.variant_id].calculated_amount,
            quantity: item.quantity,
            metadata: item?.metadata ?? {},
            cartId: data.cart.id,
          })
        })

        return items
      }
    )

    // @ts-ignore
    const items = addToCartStep({ items: lineItems })

    return cart[0]
  }
)
