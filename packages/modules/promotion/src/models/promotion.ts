import { PromotionUtils, model } from "@medusajs/framework/utils"
import ApplicationMethod from "./application-method"
import Campaign from "./campaign"
import PromotionRule from "./promotion-rule"

const Promotion = model
  .define("Promotion", {
    id: model.id({ prefix: "promo" }).primaryKey(),
    code: model.text().searchable(),
    is_automatic: model.boolean().default(false),
    is_tax_inclusive: model.boolean().default(false),
    /**
     * @since 2.12.0
     */
    limit: model.number().nullable(),
    /**
     * @since 2.12.0
     */
    used: model.number().default(0),
    type: model.enum(PromotionUtils.PromotionType).index("IDX_promotion_type"),
    status: model
      .enum(PromotionUtils.PromotionStatus)
      .index("IDX_promotion_status")
      .default(PromotionUtils.PromotionStatus.DRAFT),
    campaign: model
      .belongsTo(() => Campaign, {
        mappedBy: "promotions",
      })
      .nullable(),
    application_method: model
      .hasOne<() => typeof ApplicationMethod>(() => ApplicationMethod, {
        mappedBy: "promotion",
      })
      .nullable(),
    rules: model.manyToMany<() => typeof PromotionRule>(() => PromotionRule, {
      pivotTable: "promotion_promotion_rule",
      mappedBy: "promotions",
    }),
    /**
     * @since 2.12.0
     */
    metadata: model.json().nullable(),
  })
  .cascades({
    delete: ["application_method"],
  })
  .indexes([
    {
      name: "IDX_unique_promotion_code",
      on: ["code"],
      where: "deleted_at IS NULL",
      unique: true,
    },
    {
      name: "IDX_promotion_is_automatic",
      on: ["is_automatic"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export default Promotion
