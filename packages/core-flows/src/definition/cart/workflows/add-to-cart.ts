import {
  AddToCartWorkflowInputDTO,
  CreateLineItemForCartDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  addToCartStep,
  getVariantPriceSetsStep,
  getVariantsStep,
  validateVariantsExistStep,
} from "../steps"
import { prepareLineItemData } from "../utils/prepare-line-item-data"

// TODO: The AddToCartWorkflow are missing the following steps:
// - Confirm inventory exists (inventory module)
// - Refresh/delete shipping methods (fulfillment module)
// - Create line item adjustments (promotion module)
// - Update payment sessions (payment module)

export const addToCartWorkflowId = "add-to-cart"
export const addToCartWorkflow = createWorkflow(
  addToCartWorkflowId,
  (input: WorkflowData<AddToCartWorkflowInputDTO>) => {
    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? []).map((i) => i.variant_id)
    })

    validateVariantsExistStep({ variantIds })

    // TODO: Needs to be more flexible
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

    const variants = getVariantsStep({
      // @ts-ignore
      filter: { id: variantIds },
      config: {
        select: [
          "id",
          "title",
          "sku",
          "barcode",
          "product.id",
          "product.title",
          "product.description",
          "product.subtitle",
          "product.thumbnail",
          "product.type",
          "product.collection",
          "product.handle",
        ],
        relations: ["product"],
      },
    })

    const lineItems = transform(
      { priceSets, input, variants, cart: input.cart },
      (data) => {
        const items = (data.input.items ?? []).map((item) => {
          const variant = data.variants.find((v) => v.id === item.variant_id)!

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
