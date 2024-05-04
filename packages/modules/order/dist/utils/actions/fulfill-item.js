"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const action_key_1 = require("../action-key");
const calculate_order_change_1 = require("../calculate-order-change");
calculate_order_change_1.OrderChangeProcessing.registerActionType(action_key_1.ChangeActionType.FULFILL_ITEM, {
    operation({ action, currentOrder }) {
        var _a;
        const existing = currentOrder.items.find((item) => item.id === action.details.reference_id);
        (_a = existing.detail).fulfilled_quantity ?? (_a.fulfilled_quantity = 0);
        existing.detail.fulfilled_quantity = utils_1.MathBN.add(existing.detail.fulfilled_quantity, action.details.quantity);
    },
    revert({ action, currentOrder }) {
        const existing = currentOrder.items.find((item) => item.id === action.reference_id);
        existing.detail.fulfilled_quantity = utils_1.MathBN.sub(existing.detail.fulfilled_quantity, action.details.quantity);
    },
    validate({ action, currentOrder }) {
        const refId = action.details?.reference_id;
        if (!(0, utils_1.isDefined)(refId)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Reference ID is required.");
        }
        const existing = currentOrder.items.find((item) => item.id === refId);
        if (!existing) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Reference ID "${refId}" not found.`);
        }
        if (!action.details?.quantity) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Quantity to fulfill of item ${refId} is required.`);
        }
        if (action.details?.quantity < 1) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Quantity of item ${refId} must be greater than 0.`);
        }
        const notFulfilled = utils_1.MathBN.sub(existing.quantity, existing.detail?.fulfilled_quantity);
        const greater = utils_1.MathBN.gt(action.details?.quantity, notFulfilled);
        if (greater) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Cannot fulfill more items than what was ordered for item ${refId}.`);
        }
    },
});
//# sourceMappingURL=fulfill-item.js.map