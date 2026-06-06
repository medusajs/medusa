import { model } from "@zjedene-medusa/framework/utils"
import { OrderLineItemAdjustment } from "./line-item-adjustment"
import { OrderLineItemTaxLine } from "./line-item-tax-line"

const _OrderLineItem = model
  .define("OrderLineItem", {
    id: model.id({ prefix: "ordli" }).primaryKey(),
    title: model.text(),
    subtitle: model.text().nullable(),
    thumbnail: model.text().nullable(),
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
    is_giftcard: model.boolean().default(false),
    is_discountable: model.boolean().default(true),
    is_tax_inclusive: model.boolean().default(false),
    compare_at_unit_price: model.bigNumber().nullable(),
    unit_price: model.bigNumber().nullable(),
    is_custom_price: model.boolean().default(false),
    metadata: model.json().nullable(),
    tax_lines: model.hasMany<() => typeof OrderLineItemTaxLine>(
      () => OrderLineItemTaxLine,
      {
        mappedBy: "item",
      }
    ),
    adjustments: model.hasMany<() => typeof OrderLineItemAdjustment>(
      () => OrderLineItemAdjustment,
      {
        mappedBy: "item",
      }
    ),
  })
  .cascades({
    delete: ["tax_lines", "adjustments"],
  })
  .indexes([
    {
      name: "IDX_order_line_item_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
    {
      name: "IDX_order_line_item_product_id",
      on: ["product_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_line_item_product_type_id",
      on: ["product_type_id"],
      unique: false,
      where: "deleted_at IS NULL AND product_type_id IS NOT NULL",
    },
    {
      name: "IDX_order_line_item_variant_id",
      on: ["variant_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export const OrderLineItem = _OrderLineItem
