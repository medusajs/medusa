import { CreateOrderDTO, OrderDTO } from "@medusajs/types"
import { MathBN, MedusaError } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  confirmInventoryStep,
  findOneOrAnyRegionStep,
  findOrCreateCustomerStep,
  findSalesChannelStep,
  getVariantPriceSetsStep,
  getVariantsStep,
  validateVariantsExistStep,
} from "../../definition/cart"
import { prepareConfirmInventoryInput } from "../../definition/cart/utils/prepare-confirm-inventory-input"
import { prepareLineItemData } from "../../definition/cart/utils/prepare-line-item-data"
import { createOrdersStep, updateOrderTaxLinesStep } from "../steps"
import { prepareCustomLineItemData } from "../utils/prepare-custom-line-item-data"

export const createOrdersWorkflowId = "create-orders"
export const createOrdersWorkflow = createWorkflow(
  createOrdersWorkflowId,
  (input: WorkflowData<CreateOrderDTO>): WorkflowData<OrderDTO> => {
    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? [])
        .map((item) => item.variant_id)
        .filter(Boolean) as string[]
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
          "manage_inventory",
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
      variables: { id: salesChannel.id },
    })

    const productVariantInventoryItems = useRemoteQueryStep({
      entry_point: "product_variant_inventory_items",
      fields: ["variant_id", "inventory_item_id", "required_quantity"],
      variables: { variant_id: variantIds },
    }).config({ name: "inventory-items" })

    const confirmInventoryInput = transform(
      { productVariantInventoryItems, salesChannelLocations, input, variants },
      (data) => {
        if (!data.input.items) {
          return { items: [] }
        }

        if (!data.salesChannelLocations.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Sales channel ${data.input.sales_channel_id} is not associated with any stock locations.`
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

    const orderInput = transform(
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

        if (!variant) {
          return prepareCustomLineItemData({
            variant: {
              ...item,
            },
            unitPrice: MathBN.max(0, item.unit_price),
            quantity: item.quantity as number,
            metadata: item?.metadata ?? {},
          })
        }

        return prepareLineItemData({
          variant: variant,
          unitPrice: MathBN.max(
            0,
            item.unit_price ??
              data.priceSets[item.variant_id!]?.calculated_amount
          ),
          quantity: item.quantity as number,
          metadata: item?.metadata ?? {},
        })
      })

      return items
    })

    const orderToCreate = transform({ lineItems, orderInput }, (data) => {
      return {
        ...data.orderInput,
        items: data.lineItems,
      }
    })

    const orders = createOrdersStep([orderToCreate])
    const order = transform({ orders }, (data) => data.orders?.[0])

    /* TODO: Implement Order promotions
    refreshOrderPromotionsStep({
      id: order.id,
      promo_codes: input.promo_codes,
    })
    */

    updateOrderTaxLinesStep({ order_id: order.id })

    return order
  }
)
