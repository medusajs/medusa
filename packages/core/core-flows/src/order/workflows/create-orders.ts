import { CreateOrderDTO, OrderDTO } from "@medusajs/types"
import { MathBN, MedusaError, isPresent } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { findOneOrAnyRegionStep } from "../../definition/cart/steps/find-one-or-any-region"
import { findOrCreateCustomerStep } from "../../definition/cart/steps/find-or-create-customer"
import { findSalesChannelStep } from "../../definition/cart/steps/find-sales-channel"
import { getVariantPriceSetsStep } from "../../definition/cart/steps/get-variant-price-sets"
import { validateVariantPricesStep } from "../../definition/cart/steps/validate-variant-prices"
import { prepareLineItemData } from "../../definition/cart/utils/prepare-line-item-data"
import { createOrdersStep } from "../steps"
import { productVariantsFields } from "../utils/fields"
import { prepareCustomLineItemData } from "../utils/prepare-custom-line-item-data"

function prepareLineItems(data) {
  const items = (data.input.items ?? []).map((item) => {
    const variant = data.variants.find((v) => v.id === item.variant_id)!

    if (!variant) {
      return prepareCustomLineItemData({
        variant: {
          ...item,
        },
        unitPrice: MathBN.max(0, item.unit_price),
        isTaxInclusive: item.is_tax_inclusive,
        quantity: item.quantity as number,
        metadata: item?.metadata ?? {},
      })
    }

    return prepareLineItemData({
      variant: variant,
      unitPrice: MathBN.max(
        0,
        item.unit_price ??
          data.priceSets[item.variant_id!]?.raw_calculated_amount
      ),
      isTaxInclusive:
        item.is_tax_inclusive ??
        data.priceSets[item.variant_id!]?.is_calculated_price_tax_inclusive,
      quantity: item.quantity as number,
      metadata: item?.metadata ?? {},
      taxLines: item.tax_lines || [],
      adjustments: item.adjustments || [],
    })
  })

  return items
}

function getOrderInput(data) {
  const shippingAddress = data.input.shipping_address ?? { id: undefined }
  delete shippingAddress.id

  const billingAddress = data.input.billing_address ?? { id: undefined }
  delete billingAddress.id

  const data_ = {
    ...data.input,
    shipping_address: isPresent(shippingAddress) ? shippingAddress : undefined,
    billing_address: isPresent(billingAddress) ? billingAddress : undefined,
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
  (input: WorkflowData<CreateOrderDTO>): WorkflowResponse<OrderDTO> => {
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
        if (!data.region) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Region not found")
        }

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

    /*
    confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id: salesChannel.id,
        variants,
        items: input.items!,
      },
    })
    */

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

    return new WorkflowResponse(order)
  }
)
