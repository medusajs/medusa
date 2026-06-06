import { model } from "@zjedene-medusa/framework/utils"
import InventoryItem from "./inventory-item"

const ReservationItem = model
  .define("ReservationItem", {
    id: model.id({ prefix: "resitem" }).primaryKey(),
    line_item_id: model.text().nullable(),
    allow_backorder: model.boolean().default(false),
    location_id: model.text(),
    quantity: model.bigNumber(),
    raw_quantity: model.json(),
    external_id: model.text().nullable(),
    description: model.text().searchable().nullable(),
    created_by: model.text().nullable(),
    metadata: model.json().nullable(),
    inventory_item: model
      .belongsTo(() => InventoryItem, {
        mappedBy: "reservation_items",
      })
      .searchable(),
  })
  .indexes([
    {
      name: "IDX_reservation_item_line_item_id",
      on: ["line_item_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_reservation_item_location_id",
      on: ["location_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_reservation_item_inventory_item_id",
      on: ["inventory_item_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default ReservationItem
