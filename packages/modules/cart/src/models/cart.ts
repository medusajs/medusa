import { model } from "@medusajs/framework/utils"
import Address from "./address"
import CreditLine from "./credit-line"
import LineItem from "./line-item"
import ShippingMethod from "./shipping-method"

/**
 * Represents a shopping cart containing items and associated data.
 */
const Cart = model
  .define("Cart", {
    /**
     * The unique identifier of the cart.
     */
    id: model.id({ prefix: "cart" }).primaryKey(),
    /**
     * The ID of the region the cart belongs to.
     */
    region_id: model.text().nullable(),
    /**
     * The ID of the customer the cart belongs to.
     */
    customer_id: model.text().nullable(),
    /**
     * The ID of the sales channel the cart is associated with.
     */
    sales_channel_id: model.text().nullable(),
    /**
     * The email address associated with the cart.
     */
    email: model.text().nullable(),
    /**
     * The currency code used for the cart.
     */
    currency_code: model.text(),
    /**
     * The BCP 47 language tag code of the locale
     *
     * @since 2.12.3
     *
     * @example
     * "en-US"
     */
    locale: model.text().nullable(),
    /**
     * Additional metadata for the cart.
     */
    metadata: model.json().nullable(),
    /**
     * The timestamp when the cart was completed/converted to an order.
     */
    completed_at: model.dateTime().nullable(),
    /**
     * The shipping address for the cart.
     */
    shipping_address: model
      .hasOne(() => Address, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .nullable(),
    /**
     * The billing address for the cart.
     */
    billing_address: model
      .hasOne(() => Address, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .nullable(),
    /**
     * The line items in the cart.
     */
    items: model.hasMany(() => LineItem, {
      mappedBy: "cart",
    }),
    /**
     * The credit lines associated with the cart.
     */
    credit_lines: model.hasMany(() => CreditLine, {
      mappedBy: "cart",
    }),
    /**
     * The shipping methods selected for the cart.
     */
    shipping_methods: model.hasMany(() => ShippingMethod, {
      mappedBy: "cart",
    }),
    /**
     * The original total amount of all items in the cart before any discounts.
     *
     * @since 2.13.7
     */
    original_item_total: model.bigNumber().computed(),
    /**
     * The original subtotal amount of all items in the cart before any discounts.
     *
     * @since 2.13.7
     */
    original_item_subtotal: model.bigNumber().computed(),
    /**
     * The original tax total amount of all items in the cart before any discounts.
     *
     * @since 2.13.7
     */
    original_item_tax_total: model.bigNumber().computed(),
    /**
     * The total amount of all items in the cart after discounts.
     *
     * @since 2.13.7
     */
    item_total: model.bigNumber().computed(),
    /**
     * The subtotal amount of all items in the cart after discounts.
     *
     * @since 2.13.7
     */
    item_subtotal: model.bigNumber().computed(),
    /**
     * The tax total amount of all items in the cart after discounts.
     *
     * @since 2.13.7
     */
    item_tax_total: model.bigNumber().computed(),
    /**
     * The original total amount of the cart before any discounts.
     *
     * @since 2.13.7
     */
    original_total: model.bigNumber().computed(),
    /**
     * The original subtotal amount of the cart before any discounts.
     *
     * @since 2.13.7
     */
    original_subtotal: model.bigNumber().computed(),
    /**
     * The original tax total amount of the cart before any discounts.
     *
     * @since 2.13.7
     */
    original_tax_total: model.bigNumber().computed(),
    total: model.bigNumber().computed(),
    subtotal: model.bigNumber().computed(),
    tax_total: model.bigNumber().computed(),
    discount_total: model.bigNumber().computed(),
    discount_tax_total: model.bigNumber().computed(),
    gift_card_total: model.bigNumber().computed(),
    gift_card_tax_total: model.bigNumber().computed(),
    shipping_total: model.bigNumber().computed(),
    shipping_subtotal: model.bigNumber().computed(),
    shipping_tax_total: model.bigNumber().computed(),
    original_shipping_total: model.bigNumber().computed(),
    original_shipping_subtotal: model.bigNumber().computed(),
    original_shipping_tax_total: model.bigNumber().computed(),
  })
  .cascades({
    delete: [
      "items",
      "shipping_methods",
      "shipping_address",
      "billing_address",
    ],
  })
  .indexes([
    {
      name: "IDX_cart_region_id",
      on: ["region_id"],
      where: "deleted_at IS NULL AND region_id IS NOT NULL",
    },
    {
      name: "IDX_cart_customer_id",
      on: ["customer_id"],
      where: "deleted_at IS NULL AND customer_id IS NOT NULL",
    },
    {
      name: "IDX_cart_sales_channel_id",
      on: ["sales_channel_id"],
      where: "deleted_at IS NULL AND sales_channel_id IS NOT NULL",
    },
    {
      name: "IDX_cart_curency_code",
      on: ["currency_code"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_cart_shipping_address_id",
      on: ["shipping_address_id"],
      where: "deleted_at IS NULL AND shipping_address_id IS NOT NULL",
    },
    {
      name: "IDX_cart_billing_address_id",
      on: ["billing_address_id"],
      where: "deleted_at IS NULL AND billing_address_id IS NOT NULL",
    },
  ])

export default Cart
