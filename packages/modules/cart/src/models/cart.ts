import { model } from "@medusajs/framework/utils"
import Address from "./address"
import CreditLine from "./credit-line"
import LineItem from "./line-item"
import ShippingMethod from "./shipping-method"

const Cart = model
  .define("Cart", {
    id: model.id({ prefix: "cart" }).primaryKey(),
    region_id: model.text().nullable(),
    customer_id: model.text().nullable(),
    sales_channel_id: model.text().nullable(),
    email: model.text().nullable(),
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
    metadata: model.json().nullable(),
    completed_at: model.dateTime().nullable(),
    shipping_address: model
      .hasOne(() => Address, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .nullable(),
    billing_address: model
      .hasOne(() => Address, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .nullable(),
    items: model.hasMany(() => LineItem, {
      mappedBy: "cart",
    }),
    credit_lines: model.hasMany(() => CreditLine, {
      mappedBy: "cart",
    }),
    shipping_methods: model.hasMany(() => ShippingMethod, {
      mappedBy: "cart",
    }),
    original_item_total: model.bigNumber().computed(),
    original_item_subtotal: model.bigNumber().computed(),
    original_item_tax_total: model.bigNumber().computed(),
    item_total: model.bigNumber().computed(),
    item_subtotal: model.bigNumber().computed(),
    item_tax_total: model.bigNumber().computed(),
    original_total: model.bigNumber().computed(),
    original_subtotal: model.bigNumber().computed(),
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
