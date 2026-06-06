import { model } from "@zjedene-medusa/framework/utils"
import CampaignBudget from "./campaign-budget"

/**
 * @since 2.11.0
 */
const CampaignBudgetUsage = model
  .define(
    {
      name: "CampaignBudgetUsage",
      tableName: "promotion_campaign_budget_usage",
    },
    {
      id: model.id({ prefix: "probudgus" }).primaryKey(),
      attribute_value: model.text(), // e.g. "cus_123" | "john.smith@gmail.com"
      used: model.bigNumber().default(0),
      budget: model.belongsTo(() => CampaignBudget, {
        mappedBy: "usages",
      }),
    }
  )
  .indexes([
    {
      on: ["attribute_value", "budget_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default CampaignBudgetUsage
