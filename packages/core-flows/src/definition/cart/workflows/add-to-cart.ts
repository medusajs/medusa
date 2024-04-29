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
  refreshCartShippingMethodsStep,
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
      fields: [
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

        "calculated_price.calculated_amount",

        "inventory_items.inventory_item_id",
        "inventory_items.required_quantity",

        "inventory_items.inventory.location_levels.stock_locations.id",
        "inventory_items.inventory.location_levels.stock_locations.name",

        "inventory_items.inventory.location_levels.stock_locations.sales_channels.id",
        "inventory_items.inventory.location_levels.stock_locations.sales_channels.name",
      ],
      variables: {
        id: variantIds,
        calculated_price: {
          context: pricingContext,
        },
      },
      throw_if_key_not_found: true,
    })

    const confirmInventoryInput = transform({ input, variants }, (data) => {
      const productVariantInventoryItems: any[] = []

      const stockLocations = data.variants
        .map((v) => v.inventory_items)
        .flat()
        .map((ii) => {
          productVariantInventoryItems.push({
            variant_id: ii.variant_id,
            inventory_item_id: ii.inventory_item_id,
            required_quantity: ii.required_quantity,
          })

          return ii.inventory.location_levels
        })
        .flat()
        .map((ll) => ll.stock_locations)
        .flat()

      const salesChannelId = data.input.cart.sales_channel_id
      if (salesChannelId) {
        const salesChannels = stockLocations
          .map((sl) => sl.sales_channels)
          .flat()
          .filter((sc) => sc.id === salesChannelId)

        if (!salesChannels.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Sales channel ${data.input.cart.sales_channel_id} is not associated with any stock locations.`
          )
        }
      }

      const priceNotFound: string[] = data.variants
        .filter((v) => !v.calculated_price)
        .map((v) => v.id)

      if (priceNotFound.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Variants with IDs ${priceNotFound.join(", ")} do not have a price`
        )
      }

      const items = prepareConfirmInventoryInput({
        product_variant_inventory_items: productVariantInventoryItems,
        location_ids: stockLocations.map((l) => l.id),
        items: data.input.items!,
        variants: data.variants.map((v) => ({
          id: v.id,
          manage_inventory: v.manage_inventory,
        })),
      })

      return { items }
    })

    confirmInventoryStep(confirmInventoryInput)

    const lineItems = transform({ input, variants }, (data) => {
      const items = (data.input.items ?? []).map((item) => {
        const variant = data.variants.find((v) => v.id === item.variant_id)!

        return prepareLineItemData({
          variant: variant,
          unitPrice: variant.calculated_price.calculated_amount,
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
