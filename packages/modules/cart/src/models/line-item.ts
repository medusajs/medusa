import { model } from "@medusajs/framework/utils"
import Cart from "./cart"
import LineItemAdjustment from "./line-item-adjustment"
import LineItemTaxLine from "./line-item-tax-line"

const LineItem = model
  .define(
    { name: "LineItem", tableName: "cart_line_item" },
    {
      id: model.id({ prefix: "cali" }).primaryKey(),
      title: model.text(),
      subtitle: model.text().nullable(),
      thumbnail: model.text().nullable(),
      quantity: model.number(),
      variant_id: model.text().nullable(),
      product_id: model.text().nullable(),
      product_title: model.text().nullable(),
      product_description: model.text().nullable(),
      product_subtitle: model.text().nullable(),
      product_type: model.text().nullable(),
      product_type_id: model.text().nullable(),
      product_collection: model.text().nullable(),
      product_handle: model.text().nullable(),
      variant_sku: model.text().nullable(),
      variant_barcode: model.text().nullable(),
      variant_title: model.text().nullable(),
      variant_option_values: model.json().nullable(),
      requires_shipping: model.boolean().default(true),
      is_discountable: model.boolean().default(true),
      is_giftcard: model.boolean().default(false),
      is_tax_inclusive: model.boolean().default(false),
      is_custom_price: model.boolean().default(false),
      compare_at_unit_price: model.bigNumber().nullable(),
      unit_price: model.bigNumber(),
      metadata: model.json().nullable(),
      original_total: model.bigNumber().computed(),
      original_subtotal: model.bigNumber().computed(),
      original_tax_total: model.bigNumber().computed(),
      item_total: model.bigNumber().computed(),
      item_subtotal: model.bigNumber().computed(),
      item_tax_total: model.bigNumber().computed(),
      total: model.bigNumber().computed(),
      subtotal: model.bigNumber().computed(),
      tax_total: model.bigNumber().computed(),
      discount_total: model.bigNumber().computed(),
      discount_tax_total: model.bigNumber().computed(),
      adjustments: model.hasMany(() => LineItemAdjustment, {
        mappedBy: "item",
      }),
      tax_lines: model.hasMany(() => LineItemTaxLine, {
        mappedBy: "item",
      }),
      cart: model.belongsTo(() => Cart, {
        mappedBy: "items",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_cart_line_item_cart_id",
      on: ["cart_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_line_item_variant_id",
      on: ["variant_id"],
      where: "deleted_at IS NULL AND variant_id IS NOT NULL",
    },
    {
      name: "IDX_line_item_product_id",
      on: ["product_id"],
      where: "deleted_at IS NULL AND product_id IS NOT NULL",
    },
    {
      name: "IDX_line_item_product_type_id",
      on: ["product_type_id"],
      where: "deleted_at IS NULL AND product_type_id IS NOT NULL",
    },
  ])
  .cascades({
    delete: ["adjustments", "tax_lines"],
  })

export default LineItem
