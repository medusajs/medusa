"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByBuyGetType = exports.getComputedActionsForBuyGet = void 0;
const utils_1 = require("@medusajs/utils");
const validations_1 = require("../validations");
const usage_1 = require("./usage");
// TODO: calculations should eventually move to a totals util outside of the module
function getComputedActionsForBuyGet(promotion, itemsContext, methodIdPromoValueMap) {
    const buyRulesMinQuantity = promotion.application_method?.buy_rules_min_quantity;
    const applyToQuantity = promotion.application_method?.apply_to_quantity;
    const buyRules = promotion.application_method?.buy_rules;
    const targetRules = promotion.application_method?.target_rules;
    const computedActions = [];
    if (!itemsContext) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `"items" should be present as an array in the context to compute actions`);
    }
    if (!Array.isArray(buyRules) || !Array.isArray(targetRules)) {
        return [];
    }
    const validQuantity = itemsContext
        .filter((item) => (0, validations_1.areRulesValidForContext)(buyRules, item))
        .reduce((acc, next) => acc + next.quantity, 0);
    if (!buyRulesMinQuantity ||
        !applyToQuantity ||
        buyRulesMinQuantity > validQuantity) {
        return [];
    }
    const validItemsForTargetRules = itemsContext
        .filter((item) => (0, validations_1.areRulesValidForContext)(targetRules, item))
        .filter((item) => (0, utils_1.isPresent)(item.subtotal) && (0, utils_1.isPresent)(item.quantity))
        .sort((a, b) => {
        const aPrice = a.subtotal / a.quantity;
        const bPrice = b.subtotal / b.quantity;
        return bPrice - aPrice;
    });
    let remainingQtyToApply = applyToQuantity;
    for (const method of validItemsForTargetRules) {
        const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0;
        const multiplier = Math.min(method.quantity, remainingQtyToApply);
        const amount = (method.subtotal / method.quantity) * multiplier;
        const newRemainingQtyToApply = remainingQtyToApply - multiplier;
        if (newRemainingQtyToApply < 0 || amount <= 0) {
            break;
        }
        else {
            remainingQtyToApply = newRemainingQtyToApply;
        }
        const budgetExceededAction = (0, usage_1.computeActionForBudgetExceeded)(promotion, amount);
        if (budgetExceededAction) {
            computedActions.push(budgetExceededAction);
            continue;
        }
        methodIdPromoValueMap.set(method.id, appliedPromoValue + amount);
        computedActions.push({
            action: utils_1.ComputedActions.ADD_ITEM_ADJUSTMENT,
            item_id: method.id,
            amount,
            code: promotion.code,
        });
    }
    return computedActions;
}
exports.getComputedActionsForBuyGet = getComputedActionsForBuyGet;
function sortByBuyGetType(a, b) {
    if (a.type === utils_1.PromotionType.BUYGET && b.type !== utils_1.PromotionType.BUYGET) {
        return -1;
    }
    else if (a.type !== utils_1.PromotionType.BUYGET &&
        b.type === utils_1.PromotionType.BUYGET) {
        return 1;
    }
    else {
        return 0;
    }
}
exports.sortByBuyGetType = sortByBuyGetType;
