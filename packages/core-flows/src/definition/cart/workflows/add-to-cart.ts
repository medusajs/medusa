import {
  AddToCartWorkflowInputDTO,
  CreateLineItemForCartDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { MedusaError } from "medusa-core-utils"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import {
  addToCartStep,
  confirmInventoryStep,
  getVariantPriceSetsStep,
  getVariantsStep,
  refreshCartShippingMethodsStep,
  validateVariantsExistStep,
} from "../steps"
import { refreshCartPromotionsStep } from "../steps/refresh-cart-promotions"
import { updateTaxLinesStep } from "../steps/update-tax-lines"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { prepareConfirmInventoryInput } from "../utils/prepare-confirm-inventory-input"
import { prepareLineItemData } from "../utils/prepare-line-item-data"
import { refreshPaymentCollectionForCartStep } from "./refresh-payment-collection"

// TODO: The AddToCartWorkflow are missing the following steps:
// - Refresh/delete shipping methods (fulfillment module)

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
      fields: ["id", "name", "stock_locations.id", "stock_locations.name"],
      variables: { id: input.cart.sales_channel_id },
    })

    const productVariantInventoryItems = useRemoteQueryStep({
      entry_point: "product_variant_inventory_items",
      fields: ["variant_id", "inventory_item_id", "required_quantity"],
      variables: { variant_id: variantIds },
    }).config({ name: "inventory-items" })

    const confirmInventoryInput = transform(
      { productVariantInventoryItems, salesChannelLocations, input, variants },
      (data) => {
        if (!data.salesChannelLocations.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Sales channel ${data.input.cart.sales_channel_id} is not associated with any stock locations.`
          )
        }

        const items = prepareConfirmInventoryInput({
          product_variant_inventory_items: data.productVariantInventoryItems,
          location_ids: data.salesChannelLocations[0].stock_locations.map(
            (l) => l.id
          ),
          items: data.input.items!,
          variants: data.variants.map((v) => ({
            id: v.id,
            manage_inventory: v.manage_inventory,
          })),
        })

        return { items }
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

    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: cartFieldsForRefreshSteps,
      variables: { id: input.cart.id },
      list: false,
    }).config({ name: "refetch–cart" })

    refreshCartShippingMethodsStep({ cart })
    // TODO: since refreshCartShippingMethodsStep potentially removes cart shipping methods, we need the updated cart here
    // for the following 2 steps as they act upon final cart shape
    updateTaxLinesStep({ cart_or_cart_id: cart, items })
    refreshCartPromotionsStep({ id: input.cart.id })
    refreshPaymentCollectionForCartStep({ cart_id: input.cart.id })

    return items
  }
)
