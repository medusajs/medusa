import dotenv from "dotenv"
import { createConnection, SelectQueryBuilder } from "typeorm"
import Logger from "../loaders/logger"
import { LineItem } from "../models/line-item"
import { LineItemAdjustment } from "../models/line-item-adjustment"
import { typeormConfig } from "./db-config"

dotenv.config()

const migrate = async function({ typeormConfig }) {
  const connection = await createConnection(typeormConfig)

  const BATCH_SIZE = 1000

  await connection.transaction(async (manager) => {
    const getDiscountableLineItems = (qb: SelectQueryBuilder<any>) => {
      return qb
        .from(LineItem, "li")
        .select([
          "li.order_id as order_id",
          "SUM(li.quantity * li.unit_price)::bigint AS discountable_subtotal",
        ])
        .where("li.allow_discounts = true")
        .groupBy("li.order_id")
    }

    const getLineItemAllocations = (qb: SelectQueryBuilder<any>) =>
      qb
        .from(LineItem, "li")
        .select([
          "disc.id AS discount_id",
          "dr.allocation",
          "dr.type",
          "dr.value",
          "li.*",
          "li.order_id",
          "ods.discountable_subtotal",
          "li.quantity * li.unit_price AS li_subtotal",
          `COALESCE(ROUND(CASE
            WHEN dr.type = 'percentage' THEN li.quantity*li.unit_price * (dr.value::float / 100)
             WHEN dr.type = 'fixed' THEN li.quantity*li.unit_price * (LEAST(COALESCE(dr.value, 0), ods.discountable_subtotal)::float / ods.discountable_subtotal)
            ELSE 0
          END), 0) AS discount_total`,
        ])
        .leftJoin("order", "o", "o.id = li.order_id")
        .leftJoin("order_discounts", "od", "o.id = od.order_id")
        .leftJoin("discount", "disc", "od.discount_id = disc.id")
        .leftJoin("discount_rule", "dr", "dr.id = disc.rule_id")
        .leftJoinAndSelect(
          getDiscountableLineItems,
          "ods",
          "ods.order_id = li.order_id"
        )
        .where("dr.type != :type", { type: "free_shipping" })

    const totalAdjustments = await manager
      .createQueryBuilder()
      .from(getLineItemAllocations, "lia")
      .select("COUNT(*)")
      .getRawOne()
      .then((result) => parseInt(result.count, 10))

    let offset = 0
    while (offset < totalAdjustments) {
      const lineItemAdjustments = await manager
        .createQueryBuilder()
        .from(getLineItemAllocations, "lia")
        .select([
          "lia.id AS item_id",
          "lia.discount_id",
          "lia.discount_total AS amount",
          "'discount' AS description",
        ])
        .limit(BATCH_SIZE)
        .offset(offset)
        .getRawMany()

      await manager
        .createQueryBuilder()
        .insert()
        .into(LineItemAdjustment)
        .values(
          lineItemAdjustments.map((lia) =>
            Object.assign(new LineItemAdjustment(), {
              ...lia,
            })
          )
        )
        .orIgnore()
        .execute()
      offset += BATCH_SIZE
    }
  })
}

migrate({ typeormConfig })
  .then(() => {
    Logger.info("Database migration completed successfully")
    process.exit()
  })
  .catch((err) => console.log(err))

export default migrate
