"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComputedActionsForOrder = exports.getComputedActionsForShippingMethods = exports.getComputedActionsForItems = void 0;
const utils_1 = require("@medusajs/utils");
const validations_1 = require("../validations");
const usage_1 = require("./usage");
function validateContext(contextKey, context) {
    if (!context) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `"${contextKey}" should be present as an array in the context for computeActions`);
    }
}
function getComputedActionsForItems(promotion, items, appliedPromotionsMap, allocationOverride) {
    validateContext("items", items);
    return applyPromotionToItems(promotion, items, appliedPromotionsMap, allocationOverride);
}
exports.getComputedActionsForItems = getComputedActionsForItems;
function getComputedActionsForShippingMethods(promotion, shippingMethods, appliedPromotionsMap) {
    validateContext("shipping_methods", shippingMethods);
    return applyPromotionToItems(promotion, shippingMethods, appliedPromotionsMap);
}
exports.getComputedActionsForShippingMethods = getComputedActionsForShippingMethods;
function getComputedActionsForOrder(promotion, itemApplicationContext, methodIdPromoValueMap) {
    return getComputedActionsForItems(promotion, itemApplicationContext[utils_1.ApplicationMethodTargetType.ITEMS], methodIdPromoValueMap, utils_1.ApplicationMethodAllocation.ACROSS);
}
exports.getComputedActionsForOrder = getComputedActionsForOrder;
function applyPromotionToItems(promotion, items, appliedPromotionsMap, allocationOverride) {
    const { application_method: applicationMethod } = promotion;
    const allocation = applicationMethod?.allocation || allocationOverride;
    const computedActions = [];
    const applicableItems = getValidItemsForPromotion(items, promotion);
    const target = applicationMethod?.target_type;
    const isTargetShippingMethod = target === utils_1.ApplicationMethodTargetType.SHIPPING_METHODS;
    const isTargetLineItems = target === utils_1.ApplicationMethodTargetType.ITEMS;
    const isTargetOrder = target === utils_1.ApplicationMethodTargetType.ORDER;
    let lineItemsTotal = 0;
    if (allocation === utils_1.ApplicationMethodAllocation.ACROSS) {
        lineItemsTotal = applicableItems.reduce((acc, item) => acc + item.subtotal - (appliedPromotionsMap.get(item.id) ?? 0), 0);
    }
    for (const item of applicableItems) {
        const appliedPromoValue = appliedPromotionsMap.get(item.id) ?? 0;
        const maxQuantity = isTargetShippingMethod
            ? 1
            : applicationMethod?.max_quantity;
        if (isTargetShippingMethod) {
            item.quantity = 1;
        }
        const amount = (0, utils_1.calculateAdjustmentAmountFromPromotion)(item, {
            value: applicationMethod?.value ?? 0,
            applied_value: appliedPromoValue,
            max_quantity: maxQuantity,
            type: applicationMethod?.type,
            allocation,
        }, lineItemsTotal);
        if (amount <= 0) {
            continue;
        }
        const budgetExceededAction = (0, usage_1.computeActionForBudgetExceeded)(promotion, amount);
        if (budgetExceededAction) {
            computedActions.push(budgetExceededAction);
            continue;
        }
        appliedPromotionsMap.set(item.id, appliedPromoValue + amount);
        if (isTargetLineItems || isTargetOrder) {
            computedActions.push({
                action: utils_1.ComputedActions.ADD_ITEM_ADJUSTMENT,
                item_id: item.id,
                amount,
                code: promotion.code,
            });
        }
        if (isTargetShippingMethod) {
            computedActions.push({
                action: utils_1.ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT,
                shipping_method_id: item.id,
                amount,
                code: promotion.code,
            });
        }
    }
    return computedActions;
}
function getValidItemsForPromotion(items, promotion) {
    const isTargetShippingMethod = promotion.application_method?.target_type === utils_1.ApplicationMethodTargetType.SHIPPING_METHODS;
    return (items?.filter((item) => {
        const isSubtotalPresent = "subtotal" in item;
        const isQuantityPresent = "quantity" in item;
        const isPromotionApplicableToItem = (0, validations_1.areRulesValidForContext)(promotion?.application_method?.target_rules, item);
        return (isPromotionApplicableToItem &&
            (isQuantityPresent || isTargetShippingMethod) &&
            isSubtotalPresent);
    }) || []);
}
