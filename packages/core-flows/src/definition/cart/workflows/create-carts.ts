import { CartDTO, CreateCartWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { MedusaError } from "medusa-core-utils"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import {
  confirmInventoryStep,
  createCartsStep,
  findOneOrAnyRegionStep,
  findOrCreateCustomerStep,
  findSalesChannelStep,
  getVariantPriceSetsStep,
} from "../steps"
import { refreshCartPromotionsStep } from "../steps/refresh-cart-promotions"
import { updateTaxLinesStep } from "../steps/update-tax-lines"
import { prepareConfirmInventoryInput } from "../utils/prepare-confirm-inventory-input"
import { prepareLineItemData } from "../utils/prepare-line-item-data"
import { refreshPaymentCollectionForCartStep } from "./refresh-payment-collection"

// TODO: The createCartWorkflow are missing the following steps:
// - Refresh/delete shipping methods (fulfillment module)

export const createCartWorkflowId = "create-cart"
export const createCartWorkflow = createWorkflow(
  createCartWorkflowId,
  (input: WorkflowData<CreateCartWorkflowInputDTO>): WorkflowData<CartDTO> => {
    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? []).map((i) => i.variant_id)
    })

    const [salesChannel, region, customerData] = parallelize(
      findSalesChannelStep({
        salesChannelId: input.sales_channel_id,
      }),
      findOneOrAnyRegionStep({
        regionId: input.region_id,
      }),
      findOrCreateCustomerStep({
        customerId: input.customer_id,
        email: input.email,
      })
    )

    // TODO: This is on par with the context used in v1.*, but we can be more flexible.
    const pricingContext = transform(
      { input, region, customerData },
      (data) => {
        return {
          currency_code: data.input.currency_code ?? data.region.currency_code,
          region_id: data.region.id,
          customer_id: data.customerData.customer?.id,
        }
      }
    )

    const variants = useRemoteQueryStep({
      entry_point: "variants",
      fields: [
        "id",
        "title",
        "sku",
        "manage_inventory",
        "allow_backorder",
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

    const confirmInventoryInput = transform(
      { input, salesChannel, variants },
      (data) => {
        const managedVariants = data.variants.filter((v) => v.manage_inventory)
        if (!managedVariants.length) {
          return { items: [] }
        }

        const productVariantInventoryItems: any[] = []

        const stockLocations = managedVariants
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

        const salesChannelId = data.salesChannel?.id
        if (salesChannelId) {
          const salesChannels = stockLocations
            .map((sl) => sl.sales_channels)
            .flat()
            .filter((sc) => sc.id === salesChannelId)

          if (!salesChannels.length) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Sales channel ${salesChannelId} is not associated with any stock locations.`
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
      }
    )

    confirmInventoryStep(confirmInventoryInput)

    const priceSets = getVariantPriceSetsStep({
      variantIds,
      context: pricingContext,
    })

    const cartInput = transform(
      { input, region, customerData, salesChannel },
      (data) => {
        const data_ = {
          ...data.input,
          currency_code: data.input.currency_code ?? data.region.currency_code,
          region_id: data.region.id,
        }

        if (data.customerData.customer?.id) {
          data_.customer_id = data.customerData.customer.id
          data_.email = data.input?.email ?? data.customerData.customer.email
        }

        if (data.salesChannel?.id) {
          data_.sales_channel_id = data.salesChannel.id
        }

        return data_
      }
    )

    const lineItems = transform({ priceSets, input, variants }, (data) => {
      const items = (data.input.items ?? []).map((item) => {
        const variant = data.variants.find((v) => v.id === item.variant_id)!

        return prepareLineItemData({
          variant: variant,
          unitPrice: data.priceSets[item.variant_id].calculated_amount,
          quantity: item.quantity,
          metadata: item?.metadata ?? {},
        })
      })

      return items
    })

    const cartToCreate = transform({ lineItems, cartInput }, (data) => {
      return {
        ...data.cartInput,
        items: data.lineItems,
      }
    })

    const carts = createCartsStep([cartToCreate])
    const cart = transform({ carts }, (data) => data.carts?.[0])

    refreshCartPromotionsStep({
      id: cart.id,
      promo_codes: input.promo_codes,
    })
    updateTaxLinesStep({ cart_or_cart_id: cart.id })
    refreshPaymentCollectionForCartStep({
      cart_id: cart.id,
    })

    return cart
  }
)
