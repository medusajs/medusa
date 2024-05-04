"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPromotionToShippingMethods = exports.getComputedActionsForShippingMethods = void 0;
const utils_1 = require("@medusajs/utils");
const validations_1 = require("../validations");
const usage_1 = require("./usage");
function getComputedActionsForShippingMethods(promotion, shippingMethodApplicationContext, methodIdPromoValueMap) {
    const applicableShippingItems = [];
    if (!shippingMethodApplicationContext) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `"shipping_methods" should be present as an array in the context for computeActions`);
    }
    for (const shippingMethodContext of shippingMethodApplicationContext) {
        const isPromotionApplicableToItem = (0, validations_1.areRulesValidForContext)(promotion.application_method?.target_rules, shippingMethodContext);
        if (!isPromotionApplicableToItem) {
            continue;
        }
        applicableShippingItems.push(shippingMethodContext);
    }
    return applyPromotionToShippingMethods(promotion, applicableShippingItems, methodIdPromoValueMap);
}
exports.getComputedActionsForShippingMethods = getComputedActionsForShippingMethods;
function applyPromotionToShippingMethods(promotion, shippingMethods, methodIdPromoValueMap) {
    const { application_method: applicationMethod } = promotion;
    const allocation = applicationMethod?.allocation;
    const computedActions = [];
    if (allocation === utils_1.ApplicationMethodAllocation.EACH) {
        for (const method of shippingMethods) {
            if (!method.subtotal) {
                continue;
            }
            const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0;
            let promotionValue = applicationMethod?.value ?? 0;
            const applicableTotal = method.subtotal - appliedPromoValue;
            if (applicationMethod?.type === utils_1.ApplicationMethodType.PERCENTAGE) {
                promotionValue = (promotionValue / 100) * applicableTotal;
            }
            const amount = Math.min(promotionValue, applicableTotal);
            if (amount <= 0) {
                continue;
            }
            const budgetExceededAction = (0, usage_1.computeActionForBudgetExceeded)(promotion, amount);
            if (budgetExceededAction) {
                computedActions.push(budgetExceededAction);
                continue;
            }
            methodIdPromoValueMap.set(method.id, appliedPromoValue + amount);
            computedActions.push({
                action: utils_1.ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
                shipping_method_id: method.id,
                amount,
                code: promotion.code,
            });
        }
    }
    if (allocation === utils_1.ApplicationMethodAllocation.ACROSS) {
        const totalApplicableValue = shippingMethods.reduce((acc, method) => {
            const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0;
            return acc + (method.subtotal ?? 0) - appliedPromoValue;
        }, 0);
        if (totalApplicableValue <= 0) {
            return computedActions;
        }
        for (const method of shippingMethods) {
            if (!method.subtotal) {
                continue;
            }
            const promotionValue = applicationMethod?.value ?? 0;
            const applicableTotal = method.subtotal;
            const appliedPromoValue = methodIdPromoValueMap.get(method.id) ?? 0;
            // TODO: should we worry about precision here?
            let applicablePromotionValue = (applicableTotal / totalApplicableValue) * promotionValue -
                appliedPromoValue;
            if (applicationMethod?.type === utils_1.ApplicationMethodType.PERCENTAGE) {
                applicablePromotionValue =
                    (promotionValue / 100) * (applicableTotal - appliedPromoValue);
            }
            const amount = Math.min(applicablePromotionValue, applicableTotal);
            if (amount <= 0) {
                continue;
            }
            const budgetExceededAction = (0, usage_1.computeActionForBudgetExceeded)(promotion, amount);
            if (budgetExceededAction) {
                computedActions.push(budgetExceededAction);
                continue;
            }
            methodIdPromoValueMap.set(method.id, appliedPromoValue + amount);
            computedActions.push({
                action: utils_1.ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
                shipping_method_id: method.id,
                amount,
                code: promotion.code,
            });
        }
    }
    return computedActions;
}
exports.applyPromotionToShippingMethods = applyPromotionToShippingMethods;
