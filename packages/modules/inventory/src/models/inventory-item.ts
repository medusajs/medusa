import { model } from "@medusajs/framework/utils"
import InventoryLevel from "./inventory-level"
import ReservationItem from "./reservation-item"

const InventoryItem = model
  .define("InventoryItem", {
    id: model.id({ prefix: "iitem" }).primaryKey(),
    sku: model.text().searchable().nullable(),
    origin_country: model.text().nullable(),
    hs_code: model.text().searchable().nullable(),
    mid_code: model.text().searchable().nullable(),
    material: model.text().nullable(),
    unit_of_measure: model.text().nullable(),
    weight: model.number().nullable(),
    length: model.number().nullable(),
    height: model.number().nullable(),
    width: model.number().nullable(),
    requires_shipping: model.boolean().default(true),
    description: model.text().searchable().nullable(),
    title: model.text().searchable().nullable(),
    thumbnail: model.text().nullable(),
    metadata: model.json().nullable(),
    location_levels: model.hasMany(() => InventoryLevel, {
      mappedBy: "inventory_item",
    }),
    reservation_items: model.hasMany(() => ReservationItem, {
      mappedBy: "inventory_item",
    }),
    reserved_quantity: model.bigNumber().computed(),
    stocked_quantity: model.bigNumber().computed(),
  })
  .cascades({
    delete: ["location_levels", "reservation_items"],
  })
  .indexes([
    {
      name: "IDX_inventory_item_sku",
      on: ["sku"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default InventoryItem
