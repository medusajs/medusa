"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleType = exports.PromotionActions = exports.ComputedActions = exports.CampaignBudgetType = exports.PromotionRuleOperator = exports.ApplicationMethodAllocation = exports.ApplicationMethodTargetType = exports.ApplicationMethodType = exports.PromotionType = void 0;
var PromotionType;
(function (PromotionType) {
    PromotionType["STANDARD"] = "standard";
    PromotionType["BUYGET"] = "buyget";
})(PromotionType || (exports.PromotionType = PromotionType = {}));
var ApplicationMethodType;
(function (ApplicationMethodType) {
    ApplicationMethodType["FIXED"] = "fixed";
    ApplicationMethodType["PERCENTAGE"] = "percentage";
})(ApplicationMethodType || (exports.ApplicationMethodType = ApplicationMethodType = {}));
var ApplicationMethodTargetType;
(function (ApplicationMethodTargetType) {
    ApplicationMethodTargetType["ORDER"] = "order";
    ApplicationMethodTargetType["SHIPPING_METHODS"] = "shipping_methods";
    ApplicationMethodTargetType["ITEMS"] = "items";
})(ApplicationMethodTargetType || (exports.ApplicationMethodTargetType = ApplicationMethodTargetType = {}));
var ApplicationMethodAllocation;
(function (ApplicationMethodAllocation) {
    ApplicationMethodAllocation["EACH"] = "each";
    ApplicationMethodAllocation["ACROSS"] = "across";
})(ApplicationMethodAllocation || (exports.ApplicationMethodAllocation = ApplicationMethodAllocation = {}));
var PromotionRuleOperator;
(function (PromotionRuleOperator) {
    PromotionRuleOperator["GTE"] = "gte";
    PromotionRuleOperator["LTE"] = "lte";
    PromotionRuleOperator["GT"] = "gt";
    PromotionRuleOperator["LT"] = "lt";
    PromotionRuleOperator["EQ"] = "eq";
    PromotionRuleOperator["NE"] = "ne";
    PromotionRuleOperator["IN"] = "in";
})(PromotionRuleOperator || (exports.PromotionRuleOperator = PromotionRuleOperator = {}));
var CampaignBudgetType;
(function (CampaignBudgetType) {
    CampaignBudgetType["SPEND"] = "spend";
    CampaignBudgetType["USAGE"] = "usage";
})(CampaignBudgetType || (exports.CampaignBudgetType = CampaignBudgetType = {}));
var ComputedActions;
(function (ComputedActions) {
    ComputedActions["ADD_ITEM_ADJUSTMENT"] = "addItemAdjustment";
    ComputedActions["ADD_SHIPPING_METHOD_ADJUSTMENT"] = "addShippingMethodAdjustment";
    ComputedActions["REMOVE_ITEM_ADJUSTMENT"] = "removeItemAdjustment";
    ComputedActions["REMOVE_SHIPPING_METHOD_ADJUSTMENT"] = "removeShippingMethodAdjustment";
    ComputedActions["CAMPAIGN_BUDGET_EXCEEDED"] = "campaignBudgetExceeded";
})(ComputedActions || (exports.ComputedActions = ComputedActions = {}));
var PromotionActions;
(function (PromotionActions) {
    PromotionActions["ADD"] = "add";
    PromotionActions["REMOVE"] = "remove";
    PromotionActions["REPLACE"] = "replace";
})(PromotionActions || (exports.PromotionActions = PromotionActions = {}));
var RuleType;
(function (RuleType) {
    RuleType["RULES"] = "rules";
    RuleType["TARGET_RULES"] = "target_rules";
    RuleType["BUY_RULES"] = "buy_rules";
})(RuleType || (exports.RuleType = RuleType = {}));
//# sourceMappingURL=index.js.map