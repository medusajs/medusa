"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApplicationMethodAttributes = exports.allowedAllocationForQuantity = exports.allowedAllocationTypes = exports.allowedAllocationTargetTypes = void 0;
const utils_1 = require("@medusajs/utils");
exports.allowedAllocationTargetTypes = [
    utils_1.ApplicationMethodTargetType.SHIPPING_METHODS,
    utils_1.ApplicationMethodTargetType.ITEMS,
];
exports.allowedAllocationTypes = [
    utils_1.ApplicationMethodAllocation.ACROSS,
    utils_1.ApplicationMethodAllocation.EACH,
];
exports.allowedAllocationForQuantity = [
    utils_1.ApplicationMethodAllocation.EACH,
];
function validateApplicationMethodAttributes(data, promotion) {
    const applicationMethod = promotion?.application_method || {};
    const buyRulesMinQuantity = data.buy_rules_min_quantity || applicationMethod?.buy_rules_min_quantity;
    const applyToQuantity = data.apply_to_quantity || applicationMethod?.apply_to_quantity;
    const targetType = data.target_type || applicationMethod?.target_type;
    const type = data.type || applicationMethod?.type;
    const applicationMethodType = data.type || applicationMethod?.type;
    const value = data.value || applicationMethod.value;
    const maxQuantity = data.max_quantity || applicationMethod.max_quantity;
    const allocation = data.allocation || applicationMethod.allocation;
    const allTargetTypes = Object.values(utils_1.ApplicationMethodTargetType);
    if (type === utils_1.ApplicationMethodType.PERCENTAGE &&
        (typeof value !== "number" || value <= 0 || value > 100)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Application Method value should be a percentage number between 0 and 100`);
    }
    if (promotion?.type === utils_1.PromotionType.BUYGET) {
        if (!(0, utils_1.isPresent)(applyToQuantity)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `apply_to_quantity is a required field for Promotion type of ${utils_1.PromotionType.BUYGET}`);
        }
        if (!(0, utils_1.isPresent)(buyRulesMinQuantity)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `buy_rules_min_quantity is a required field for Promotion type of ${utils_1.PromotionType.BUYGET}`);
        }
    }
    if (allocation === utils_1.ApplicationMethodAllocation.ACROSS &&
        (0, utils_1.isPresent)(maxQuantity)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `application_method.max_quantity is not allowed to be set for allocation (${utils_1.ApplicationMethodAllocation.ACROSS})`);
    }
    if (!allTargetTypes.includes(targetType)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `application_method.target_type should be one of ${allTargetTypes.join(", ")}`);
    }
    const allTypes = Object.values(utils_1.ApplicationMethodType);
    if (!allTypes.includes(applicationMethodType)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `application_method.type should be one of ${allTypes.join(", ")}`);
    }
    if (exports.allowedAllocationTargetTypes.includes(targetType) &&
        !exports.allowedAllocationTypes.includes(allocation || "")) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `application_method.allocation should be either '${exports.allowedAllocationTypes.join(" OR ")}' when application_method.target_type is either '${exports.allowedAllocationTargetTypes.join(" OR ")}'`);
    }
    const allAllocationTypes = Object.values(utils_1.ApplicationMethodAllocation);
    if (allocation && !allAllocationTypes.includes(allocation)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `application_method.allocation should be one of ${allAllocationTypes.join(", ")}`);
    }
    if (allocation &&
        exports.allowedAllocationForQuantity.includes(allocation) &&
        !(0, utils_1.isDefined)(maxQuantity)) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `application_method.max_quantity is required when application_method.allocation is '${exports.allowedAllocationForQuantity.join(" OR ")}'`);
    }
}
exports.validateApplicationMethodAttributes = validateApplicationMethodAttributes;
