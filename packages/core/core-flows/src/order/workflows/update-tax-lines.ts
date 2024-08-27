import { OrderWorkflowDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  getOrderItemTaxLinesStep,
  setOrderTaxLinesForItemsStep,
} from "../steps"

const completeOrderFields = [
  "id",
  "currency_code",
  "email",
  "region.id",
  "region.automatic_taxes",
  "items.id",
  "items.variant_id",
  "items.product_id",
  "items.product_title",
  "items.product_description",
  "items.product_subtitle",
  "items.product_type",
  "items.product_collection",
  "items.product_handle",
  "items.variant_sku",
  "items.variant_barcode",
  "items.variant_title",
  "items.title",
  "items.quantity",
  "items.unit_price",
  "items.tax_lines.id",
  "items.tax_lines.description",
  "items.tax_lines.code",
  "items.tax_lines.rate",
  "items.tax_lines.provider_id",
  "shipping_methods.tax_lines.id",
  "shipping_methods.tax_lines.description",
  "shipping_methods.tax_lines.code",
  "shipping_methods.tax_lines.rate",
  "shipping_methods.tax_lines.provider_id",
  "shipping_methods.shipping_option_id",
  "shipping_methods.amount",
  "customer.id",
  "customer.email",
  "customer.groups.id",
  "shipping_address.id",
  "shipping_address.address_1",
  "shipping_address.address_2",
  "shipping_address.city",
  "shipping_address.postal_code",
  "shipping_address.country_code",
  "shipping_address.region_code",
  "shipping_address.province",
]

const orderFields = [
  "id",
  "currency_code",
  "email",
  "region.id",
  "region.automatic_taxes",
  "shipping_methods.tax_lines.id",
  "shipping_methods.tax_lines.description",
  "shipping_methods.tax_lines.code",
  "shipping_methods.tax_lines.rate",
  "shipping_methods.tax_lines.provider_id",
  "shipping_methods.shipping_option_id",
  "shipping_methods.amount",
  "customer.id",
  "customer.email",
  "customer.groups.id",
  "shipping_address.id",
  "shipping_address.address_1",
  "shipping_address.address_2",
  "shipping_address.city",
  "shipping_address.postal_code",
  "shipping_address.country_code",
  "shipping_address.region_code",
  "shipping_address.province",
]

const shippingMethodFields = [
  "id",
  "shipping_option_id",
  "amount",
  "tax_lines.id",
  "tax_lines.description",
  "tax_lines.code",
  "tax_lines.rate",
  "tax_lines.provider_id",
]

const lineItemFields = [
  "id",
  "variant_id",
  "product_id",
  "product_title",
  "product_description",
  "product_subtitle",
  "product_type",
  "product_collection",
  "product_handle",
  "variant_sku",
  "variant_barcode",
  "variant_title",
  "title",
  "quantity",
  "unit_price",
  "tax_lines.id",
  "tax_lines.description",
  "tax_lines.code",
  "tax_lines.rate",
  "tax_lines.provider_id",
]
export type UpdateOrderTaxLinesWorkflowInput = {
  order_id: string
  item_ids?: string[]
  shipping_method_ids?: string[]
  force_tax_calculation?: boolean
  is_return?: boolean
  shipping_address?: OrderWorkflowDTO["shipping_address"]
}

export const updateOrderTaxLinesWorkflowId = "update-order-tax-lines"
/**
 * This workflow updates the tax lines of items and shipping methods in an order.
 */
export const updateOrderTaxLinesWorkflow = createWorkflow(
  updateOrderTaxLinesWorkflowId,
  (
    input: WorkflowData<UpdateOrderTaxLinesWorkflowInput>
  ): WorkflowData<void> => {
    const variables = transform(input, (data) => {
      const variableFilter: any = {
        id: data.order_id,
      }

      if (data.item_ids) {
        variableFilter["filters"] = {
          items: {
            id: data.item_ids,
          },
        }
      }

      if (data.shipping_method_ids) {
        variableFilter["shipping_methodss"] = {
          id: data.shipping_method_ids,
        }
      }

      console.log("variableFilter", JSON.stringify(variableFilter, null, 2))
      return variableFilter
    })

    const isFullOrder = transform(input, (data) => {
      return !data.item_ids && !data.shipping_method_ids
    })

    const fetchOrderFields = transform(isFullOrder, (isFullOrder) => {
      return isFullOrder ? completeOrderFields : orderFields
    })

    const order = useRemoteQueryStep({
      entry_point: "order",
      fields: fetchOrderFields,
      variables: { id: input.order_id },
    })

    const entity = when(isFullOrder, (isFullOrder) => {
      return !isFullOrder
    }).then(() => {
      const items = useRemoteQueryStep({
        entry_point: "line_item",
        fields: lineItemFields,
        variables: { id: input.item_ids },
      }).config({ name: "query-order-line-items" })

      const shippingMethods = useRemoteQueryStep({
        entry_point: "shipping_method",
        fields: shippingMethodFields,
        variables: { id: input.shipping_method_ids },
      }).config({ name: "query-order-shipping-methods" })

      return {
        items,
        shippingMethods,
      }
    })

    const taxLineItems = getOrderItemTaxLinesStep(
      transform({ input, order, entity }, (data) => {
        console.log(
          JSON.stringify(data.entity, null, 2),
          "---------------------**************data.order*"
        )
        return {
          order: data.order,
          items: data.entity?.items ?? data.order.items,
          shipping_methods:
            data.entity?.shippingMethods ?? data.order.shipping_methods,
          force_tax_calculation: data.input.force_tax_calculation,
          is_return: data.input.is_return ?? false,
          shipping_address: data.input.shipping_address,
        }
      })
    )

    setOrderTaxLinesForItemsStep({
      order,
      item_tax_lines: taxLineItems.lineItemTaxLines,
      shipping_tax_lines: taxLineItems.shippingMethodsTaxLines,
    })
  }
)
