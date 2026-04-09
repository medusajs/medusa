import {
  CartLineItemDTO,
  CartShippingMethodDTO,
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { getItemTaxLinesStep } from "../../tax/steps/get-item-tax-lines"
import { validateCartStep } from "../steps"
import { upsertTaxLinesForItemsStep } from "../steps/upsert-tax-lines-for-items"
import { getTranslatedTaxLinesStep } from "../../common/steps/get-translated-tax-lines"

const cartFields = [
  "id",
  "locale",
  "currency_code",
  "email",
  "region.id",
  "region.automatic_taxes",
  "items.id",
  "items.variant_id",
  "items.product_id",
  "items.product.is_giftcard",
  "items.product_title",
  "items.product_description",
  "items.product_subtitle",
  "items.product_type",
  "items.product_type_id",
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
  "customer.metadata",
  "customer.groups.id",
  "shipping_address.id",
  "shipping_address.address_1",
  "shipping_address.address_2",
  "shipping_address.city",
  "shipping_address.postal_code",
  "shipping_address.country_code",
  "shipping_address.region_code",
  "shipping_address.province",
  "shipping_address.metadata",
]

/**
 * The details of the cart to upsert tax lines for.
 */
export type UpsertTaxLinesWorkflowInput = {
  /**
   * The cart's ID.
   */
  cart_id?: string
  /**
   * The Cart reference.
   */
  cart?: any
  /**
   * The items to upsert their tax lines.
   * If not specified, taxes are upsertd for all of the cart's
   * line items.
   */
  items: CartLineItemDTO[]
  /**
   * The shipping methods to upsert their tax lines.
   * If not specified, taxes are upsertd for all of the cart's
   * shipping methods.
   */
  shipping_methods: CartShippingMethodDTO[]

  /**
   * Whether to force re-calculating tax amounts, which
   * may include sending requests to a third-part tax provider, depending
   * on the configurations of the cart's tax region.
   *
   * @defaultValue false
   */
  force_tax_calculation?: boolean
}

export const upsertTaxLinesWorkflowId = "upsert-tax-lines"
/**
 * This workflow upserts a cart's tax lines that are applied on line items and shipping methods. You can upsert the line item's quantity, unit price, and more. This workflow is executed
 * by the [Calculate Taxes Store API Route](https://docs.medusajs.com/api/store#carts_postcartsidtaxes).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to upsert a cart's tax lines in your custom flows.
 *
 * @example
 * const { result } = await upsertTaxLinesWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *    items: [],
 *    shipping_methods: [],
 *   }
 * })
 *
 * @summary
 *
 * Update a cart's tax lines.
 */
export const upsertTaxLinesWorkflow = createWorkflow(
  upsertTaxLinesWorkflowId,
  (input: WorkflowData<UpsertTaxLinesWorkflowInput>): WorkflowData<void> => {
    const fetchCart = when("should-fetch-cart", { input }, ({ input }) => {
      return !input.cart
    }).then(() => {
      const { data: cart } = useQueryGraphStep({
        entity: "cart",
        fields: cartFields,
        filters: { id: input.cart_id },
        options: {
          throwIfKeyNotFound: true,
          isList: false,
        },
      }).config({ name: "fetch-cart" })

      return cart
    })

    const cart = transform({ fetchCart, input }, ({ fetchCart, input }) => {
      return input.cart ?? fetchCart
    })

    validateCartStep({ cart })

    const taxLineItems = getItemTaxLinesStep(
      transform({ input, cart }, (data) => ({
        orderOrCart: data.cart,
        items: data.input.items ?? [],
        shipping_methods: data.input.shipping_methods ?? [],
        force_tax_calculation: data.input.force_tax_calculation,
      }))
    )

    const translatedTaxLines = getTranslatedTaxLinesStep({
      itemTaxLines: taxLineItems.lineItemTaxLines,
      shippingTaxLines: taxLineItems.shippingMethodsTaxLines,
      locale: cart.locale,
    })

    upsertTaxLinesForItemsStep({
      cart,
      item_tax_lines: translatedTaxLines.itemTaxLines as ItemTaxLineDTO[],
      shipping_tax_lines:
        translatedTaxLines.shippingTaxLines as ShippingTaxLineDTO[],
    })
  }
)
