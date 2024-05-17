import { CreateOrderDTO, OrderDTO } from "@medusajs/types"
import { MathBN, MedusaError } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { validateVariantPricesStep } from "../../definition"
import { findOneOrAnyRegionStep } from "../../definition/cart/steps/find-one-or-any-region"
import { findOrCreateCustomerStep } from "../../definition/cart/steps/find-or-create-customer"
import { findSalesChannelStep } from "../../definition/cart/steps/find-sales-channel"
import { getVariantPriceSetsStep } from "../../definition/cart/steps/get-variant-price-sets"
import { prepareConfirmInventoryInput } from "../../definition/cart/utils/prepare-confirm-inventory-input"
import { prepareLineItemData } from "../../definition/cart/utils/prepare-line-item-data"
import { confirmVariantInventoryWorkflow } from "../../definition/cart/workflows/confirm-variant-inventory"
import { createOrdersStep, updateOrderTaxLinesStep } from "../steps"
import { productVariantsFields } from "../utils/fields"
import { prepareCustomLineItemData } from "../utils/prepare-custom-line-item-data"

function transformInventoryInput(data) {
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

function prepareLineItems(data) {
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
        item.unit_price ?? data.priceSets[item.variant_id!]?.calculated_amount
      ),
      quantity: item.quantity as number,
      metadata: item?.metadata ?? {},
      taxLines: item.tax_lines || [],
      adjustments: item.adjustments || [],
    })
  })

  return items
}

function getOrderInput(data) {
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

    confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id: salesChannel.id,
        variants,
        items: input.items!,
      },
    })

    const priceSets = getVariantPriceSetsStep({
      variantIds,
      context: pricingContext,
    })

    const orderInput = transform(
      { input, region, customerData, salesChannel },
      getOrderInput
    )

    const lineItems = transform(
      { priceSets, input, variants },
      prepareLineItems
    )

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
