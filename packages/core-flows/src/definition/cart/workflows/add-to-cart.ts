import {
  AddToCartWorkflowInputDTO,
  CreateLineItemForCartDTO,
} from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import {
  addToCartStep,
  confirmInventoryStep,
  getVariantPriceSetsStep,
  getVariantsStep,
  validateVariantsExistStep,
} from "../steps"
import { refreshCartPromotionsStep } from "../steps/refresh-cart-promotions"
import { updateTaxLinesStep } from "../steps/update-tax-lines"
import { prepareLineItemData } from "../utils/prepare-line-item-data"

// TODO: The AddToCartWorkflow are missing the following steps:
// - Refresh/delete shipping methods (fulfillment module)
// - Update payment sessions (payment module)

export const addToCartWorkflowId = "add-to-cart"
export const addToCartWorkflow = createWorkflow(
  addToCartWorkflowId,
  (input: WorkflowData<AddToCartWorkflowInputDTO>) => {
    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? []).map((i) => i.variant_id)
    })

    validateVariantsExistStep({ variantIds })

    const variants = getVariantsStep({
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

    const salesChannelLocations = useRemoteQueryStep({
      entry_point: "sales_channels",
      fields: ["id", "name", "locations.id", "locations.name"],
      variables: { id: input.cart.sales_channel_id },
    })

    const productVariantInventoryItems = useRemoteQueryStep({
      entry_point: "product_variant_inventory_items",
      fields: ["variant_id", "inventory_item_id", "required_quantity"],
      variables: { variant_id: variantIds },
    }).config({ name: "inventory-items" })

    const confirmInventoryInput = transform(
      { productVariantInventoryItems, salesChannelLocations, input },
      (data) => {
        if (!data.salesChannelLocations.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Sales channel ${data.input.cart.sales_channel_id} is not associated with any stock locations.`
          )
        }

        const locationIds = data.salesChannelLocations[0].locations.map(
          (l) => l.id
        )

        const itemsToConfirm = data.input.items?.map((item) => {
          const variantInventoryItem = data.productVariantInventoryItems.find(
            (i) => i.variant_id === item.variant_id
          )

          if (!variantInventoryItem) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Variant ${item.variant_id} does not have any inventory items associated with it.`
            )
          }

          return {
            inventory_item_id: variantInventoryItem.inventory_item_id,
            required_quantity: variantInventoryItem.required_quantity,
            quantity: item.quantity,
            location_ids: locationIds,
          }
        })

        return {
          items: itemsToConfirm ?? [],
        }
      }
    )

    confirmInventoryStep(confirmInventoryInput)

    // TODO: This is on par with the context used in v1.*, but we can be more flexible.
    const pricingContext = transform({ cart: input.cart }, (data) => {
      return {
        currency_code: data.cart.currency_code,
        region_id: data.cart.region_id,
        customer_id: data.cart.customer_id,
      }
    })

    const priceSets = getVariantPriceSetsStep({
      variantIds,
      context: pricingContext,
    })

    const lineItems = transform({ priceSets, input, variants }, (data) => {
      const items = (data.input.items ?? []).map((item) => {
        const variant = data.variants.find((v) => v.id === item.variant_id)!

        return prepareLineItemData({
          variant: variant,
          unitPrice: data.priceSets[item.variant_id].calculated_amount,
          quantity: item.quantity,
          metadata: item?.metadata ?? {},
          cartId: data.input.cart.id,
        }) as CreateLineItemForCartDTO
      })

      return items
    })

    const items = addToCartStep({ items: lineItems })

    updateTaxLinesStep({
      cart_or_cart_id: input.cart,
      items,
      // TODO: add shipping methods here when its ready
    })

    refreshCartPromotionsStep({ id: input.cart.id })

    return items
  }
)
