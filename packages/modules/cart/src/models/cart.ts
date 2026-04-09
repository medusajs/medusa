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
