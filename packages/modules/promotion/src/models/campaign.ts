import { model } from "@zjedene-medusa/framework/utils"
import CampaignBudget from "./campaign-budget"
import Promotion from "./promotion"

const Campaign = model
  .define(
    { name: "Campaign", tableName: "promotion_campaign" },
    {
      id: model.id({ prefix: "procamp" }).primaryKey(),
      name: model.text().searchable(),
      description: model.text().searchable().nullable(),
      campaign_identifier: model.text(),
      starts_at: model.dateTime().nullable(),
      ends_at: model.dateTime().nullable(),
      budget: model
        .hasOne<() => typeof CampaignBudget>(() => CampaignBudget, {
          mappedBy: "campaign",
        })
        .nullable(),
      promotions: model.hasMany(() => Promotion, {
        mappedBy: "campaign",
      }),
    }
  )
  .cascades({
    delete: ["budget"],
  })
  .indexes([
    {
      on: ["campaign_identifier"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default Campaign
