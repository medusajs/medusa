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
  getVariantsStep,
  validateVariantsExistStep,
} from "../steps"
import { updateTaxLinesStep } from "../steps/update-tax-lines"
import { prepareLineItemData } from "../utils/prepare-line-item-data"

// TODO: The createCartWorkflow are missing the following steps:
// - Refresh/delete shipping methods (fulfillment module)
// - Refresh/create line item adjustments (promotion module)
// - Update payment sessions (payment module)

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
      }),
      validateVariantsExistStep({ variantIds })
    )

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
      variables: { id: salesChannel.id },
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
            `Sales channel ${data.salesChannelLocations[0].id} is not associated with any stock locations.`
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

    updateTaxLinesStep({ cart_or_cart_id: cart.id })

    return cart
  }
)
