import { OrderLineItemDTO, OrderShippingMethodDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  getOrderItemTaxLinesStep,
  setOrderTaxLinesForItemsStep,
} from "../steps"

const orderFields = [
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

type WorkflowInput = {
  order_id: string
  items?: OrderLineItemDTO[]
  shipping_methods?: OrderShippingMethodDTO[]
  force_tax_calculation?: boolean
}

export const updateOrderTaxLinesWorkflowId = "update-order-tax-lines"
export const updateOrderTaxLinesWorkflow = createWorkflow(
  updateOrderTaxLinesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    const order = useRemoteQueryStep({
      entry_point: "order",
      fields: orderFields,
      variables: { id: input.order_id },
    })

    const taxLineItems = getOrderItemTaxLinesStep(
      transform({ input, order }, (data) => ({
        order: data.order,
        items: data.input.items || data.order.items,
        shipping_methods:
          data.input.shipping_methods || data.order.shipping_methods,
        force_tax_calculation: data.input.force_tax_calculation,
      }))
    )

    setOrderTaxLinesForItemsStep({
      order,
      item_tax_lines: taxLineItems.lineItemTaxLines,
      shipping_tax_lines: taxLineItems.shippingMethodsTaxLines,
    })
  }
)
