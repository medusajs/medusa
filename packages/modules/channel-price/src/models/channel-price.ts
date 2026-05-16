// packages/modules/channel-price/src/models/channel-price.ts
import { model } from "@medusajs/framework/utils"
import { PRICE_TYPE } from "../types"

const ChannelPrice = model
  .define("ChannelPrice", {
    id: model.id({ prefix: "chprice" }).primaryKey(),
    sales_material_id: model.text(),
    shop_id: model.text().nullable(),
    customer_class_id: model.text().nullable(),
    price_type: model.enum(PRICE_TYPE),
    currency_code: model.text().default("CNY"),
    amount: model.float(),
    start_at: model.dateTime().nullable(),
    end_at: model.dateTime().nullable(),
    min_quantity: model.number().nullable(),
    max_quantity: model.number().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_channel_price_sales_material",
      on: ["sales_material_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_channel_price_shop",
      on: ["shop_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default ChannelPrice
