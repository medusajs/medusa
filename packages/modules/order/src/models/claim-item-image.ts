import { model } from "@zjedene-medusa/framework/utils"
import { OrderClaimItem } from "./claim-item"

const _OrderClaimItemImage = model
  .define("OrderClaimItemImage", {
    id: model.id({ prefix: "climg" }).primaryKey(),
    claim_item: model.belongsTo<() => typeof OrderClaimItem>(
      () => OrderClaimItem,
      {
        mappedBy: "images",
      }
    ),
    url: model.text(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_order_claim_item_image_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
    {
      name: "IDX_order_claim_item_image_claim_item_id",
      on: ["claim_item_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export const OrderClaimItemImage = _OrderClaimItemImage
