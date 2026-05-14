export enum PromotionType {
  STANDARD = "standard",
  BUYGET = "buyget",
}

export enum PromotionStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum ApplicationMethodType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
}

export enum ApplicationMethodTargetType {
  ORDER = "order",
  SHIPPING_METHODS = "shipping_methods",
  ITEMS = "items",
}

export enum ApplicationMethodAllocation {
  EACH = "each",
  ACROSS = "across",
  ONCE = "once",
}

export enum PromotionRuleOperator {
  GTE = "gte",
  LTE = "lte",
  GT = "gt",
  LT = "lt",
  EQ = "eq",
  NE = "ne",
  IN = "in",
}

export enum CampaignBudgetType {
  SPEND = "spend",
  USAGE = "usage",
  USE_BY_ATTRIBUTE = "use_by_attribute",
  SPEND_BY_ATTRIBUTE = "spend_by_attribute",
}

export enum ComputedActions {
  ADD_ITEM_ADJUSTMENT = "addItemAdjustment",
  ADD_SHIPPING_METHOD_ADJUSTMENT = "addShippingMethodAdjustment",
  REMOVE_ITEM_ADJUSTMENT = "removeItemAdjustment",
  REMOVE_SHIPPING_METHOD_ADJUSTMENT = "removeShippingMethodAdjustment",
  CAMPAIGN_BUDGET_EXCEEDED = "campaignBudgetExceeded",
  PROMOTION_LIMIT_EXCEEDED = "promotionLimitExceeded",
}

export enum PromotionActions {
  ADD = "add",
  REMOVE = "remove",
  REPLACE = "replace",
}

export enum RuleType {
  RULES = "rules",
  TARGET_RULES = "target_rules",
  BUY_RULES = "buy_rules",
}
