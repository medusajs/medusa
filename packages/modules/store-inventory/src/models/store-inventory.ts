import { model } from "@medusajs/framework/utils"
import { STORE_MODE } from "../types"

const StoreInventory = model
  .define("StoreInventory", {
    id: model.id({ prefix: "sinv" }).primaryKey(),
    location_id: model.text(),
    material_id: model.text(),
    online_stock: model.number().default(0),
    online_reserved: model.number().default(0),
    share_stock: model.number().default(0),
    share_reserved: model.number().default(0),
    in_transit_stock: model.number().default(0),
    store_mode: model.enum(STORE_MODE).default("normal"),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_store_inventory_location_material",
      on: ["location_id", "material_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default StoreInventory
