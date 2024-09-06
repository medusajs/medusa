export default `
enum PromotionTypeValues {
  standard
  buyget
}

enum PromotionRuleOperatorValues {
  gt
  lt
  eq
  ne
  in
  lte
  gte
}

enum CampaignBudgetTypeValues {
  spend
  usage
}

enum ApplicationMethodTypeValues {
  fixed
  percentage
}

enum ApplicationMethodTargetTypeValues {
  order
  shipping_methods
  items
}

enum ApplicationMethodAllocationValues {
  each
  across
}

type Promotion {
  id: ID!
  code: String
  type: PromotionTypeValues
  is_automatic: Boolean
  application_method: ApplicationMethod
  rules: [PromotionRule]
  campaign_id: String
  campaign: Campaign
}

type PromotionRule {
  id: ID!
  description: String
  attribute: String
  operator: PromotionRuleOperatorValues
  values: [PromotionRuleValue!]!
}

type PromotionRuleValue {
  id: ID!
  value: String
}

type Campaign {
  id: ID!
  name: String
  description: String
  campaign_identifier: String
  starts_at: DateTime
  ends_at: DateTime
  budget: CampaignBudget
  promotions: [Promotion]
}

type CampaignBudget {
  id: ID!
  type: CampaignBudgetTypeValues
  limit: Int
  used: Int
  currency_code: String
}

type ApplicationMethod {
  id: ID!
  type: ApplicationMethodTypeValues
  target_type: ApplicationMethodTargetTypeValues
  allocation: ApplicationMethodAllocationValues
  value: Float
  currency_code: String
  max_quantity: Int
  buy_rules_min_quantity: Int
  apply_to_quantity: Int
  promotion: Promotion
  target_rules: [PromotionRule]
  buy_rules: [PromotionRule]
}

`
