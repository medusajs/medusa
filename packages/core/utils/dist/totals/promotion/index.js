"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAdjustmentAmountFromPromotion = exports.getApplicableQuantity = exports.getPromotionValue = void 0;
var promotion_1 = require("../../promotion");
function getPromotionValueForPercentage(promotion, lineItemTotal) {
    return (promotion.value / 100) * lineItemTotal;
}
function getPromotionValueForFixed(promotion, lineItemTotal, lineItemsTotal) {
    if (promotion.allocation === promotion_1.ApplicationMethodAllocation.ACROSS) {
        return (lineItemTotal / lineItemsTotal) * promotion.value;
    }
    return promotion.value;
}
function getPromotionValue(promotion, lineItemTotal, lineItemsTotal) {
    if (promotion.type === promotion_1.ApplicationMethodType.PERCENTAGE) {
        return getPromotionValueForPercentage(promotion, lineItemTotal);
    }
    return getPromotionValueForFixed(promotion, lineItemTotal, lineItemsTotal);
}
exports.getPromotionValue = getPromotionValue;
function getApplicableQuantity(lineItem, maxQuantity) {
    if (maxQuantity && lineItem.quantity) {
        return Math.min(lineItem.quantity, maxQuantity);
    }
    return lineItem.quantity;
}
exports.getApplicableQuantity = getApplicableQuantity;
function getLineItemUnitPrice(lineItem) {
    return lineItem.subtotal / lineItem.quantity;
}
function calculateAdjustmentAmountFromPromotion(lineItem, promotion, lineItemsTotal) {
    if (lineItemsTotal === void 0) { lineItemsTotal = 0; }
    var quantity = getApplicableQuantity(lineItem, promotion.max_quantity);
    var lineItemTotal = getLineItemUnitPrice(lineItem) * quantity;
    var applicableTotal = lineItemTotal - promotion.applied_value;
    if (applicableTotal <= 0) {
        return applicableTotal;
    }
    var promotionValue = getPromotionValue(promotion, applicableTotal, lineItemsTotal);
    return Math.min(promotionValue, applicableTotal);
}
exports.calculateAdjustmentAmountFromPromotion = calculateAdjustmentAmountFromPromotion;
//# sourceMappingURL=index.js.map