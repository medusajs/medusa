export declare enum PromotionType {
    STANDARD = "standard",
    BUYGET = "buyget"
}
export declare enum ApplicationMethodType {
    FIXED = "fixed",
    PERCENTAGE = "percentage"
}
export declare enum ApplicationMethodTargetType {
    ORDER = "order",
    SHIPPING_METHODS = "shipping_methods",
    ITEMS = "items"
}
export declare enum ApplicationMethodAllocation {
    EACH = "each",
    ACROSS = "across"
}
export declare enum PromotionRuleOperator {
    GTE = "gte",
    LTE = "lte",
    GT = "gt",
    LT = "lt",
    EQ = "eq",
    NE = "ne",
    IN = "in"
}
export declare enum CampaignBudgetType {
    SPEND = "spend",
    USAGE = "usage"
}
export declare enum ComputedActions {
    ADD_ITEM_ADJUSTMENT = "addItemAdjustment",
    ADD_SHIPPING_METHOD_ADJUSTMENT = "addShippingMethodAdjustment",
    REMOVE_ITEM_ADJUSTMENT = "removeItemAdjustment",
    REMOVE_SHIPPING_METHOD_ADJUSTMENT = "removeShippingMethodAdjustment",
    CAMPAIGN_BUDGET_EXCEEDED = "campaignBudgetExceeded"
}
export declare enum PromotionActions {
    ADD = "add",
    REMOVE = "remove",
    REPLACE = "replace"
}
export declare enum RuleType {
    RULES = "rules",
    TARGET_RULES = "target_rules",
    BUY_RULES = "buy_rules"
}
