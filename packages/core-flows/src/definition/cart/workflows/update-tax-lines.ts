import { CartLineItemDTO, CartWorkflowDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  getItemTaxLinesStep,
  retrieveCartWithLinksStep,
  setTaxLinesForItemsStep,
} from "../steps"

type WorkflowInput = {
  cartOrCartId: string | CartWorkflowDTO
  items?: CartLineItemDTO[]
}

export const updateTaxLinesWorkflowId = "update-tax-lines"
export const updateTaxLinesWorkflow = createWorkflow(
  updateTaxLinesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    const cart = retrieveCartWithLinksStep(
      transform({ input }, (data) => ({
        cartOrCartId: data.input.cartOrCartId,
        fields: cartFields,
      }))
    )

    const taxLineItems = getItemTaxLinesStep(
      transform({ input, cart }, (data) => ({
        cart: data.cart,
        items: data.input.items || data.cart.items,
      }))
    )

    setTaxLinesForItemsStep(
      transform({ taxLineItems, input, cart }, (data) => ({
        cart: data.cart,
        taxLines: data.taxLineItems,
      }))
    )
  }
)

const cartFields = [
  "id",
  "currency_code",
  "email",
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
