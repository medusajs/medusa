"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeActionForBudgetExceeded = exports.canRegisterUsage = void 0;
const utils_1 = require("@medusajs/utils");
function canRegisterUsage(computedAction) {
    return [
        utils_1.ComputedActions.ADD_ITEM_ADJUSTMENT,
        utils_1.ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
    ].includes(computedAction.action);
}
exports.canRegisterUsage = canRegisterUsage;
function computeActionForBudgetExceeded(promotion, amount) {
    const campaignBudget = promotion.campaign?.budget;
    if (!campaignBudget) {
        return;
    }
    const campaignBudgetUsed = campaignBudget.used ?? 0;
    const totalUsed = campaignBudget.type === utils_1.CampaignBudgetType.SPEND
        ? campaignBudgetUsed + amount
        : campaignBudgetUsed + 1;
    if (campaignBudget.limit && totalUsed > campaignBudget.limit) {
        return {
            action: utils_1.ComputedActions.CAMPAIGN_BUDGET_EXCEEDED,
            code: promotion.code,
        };
    }
}
exports.computeActionForBudgetExceeded = computeActionForBudgetExceeded;
