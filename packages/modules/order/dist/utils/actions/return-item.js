"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const action_key_1 = require("../action-key");
const calculate_order_change_1 = require("../calculate-order-change");
calculate_order_change_1.OrderChangeProcessing.registerActionType(action_key_1.ChangeActionType.RETURN_ITEM, {
    isDeduction: true,
    awaitRequired: true,
    operation({ action, currentOrder }) {
        var _a;
        const existing = currentOrder.items.find((item) => item.id === action.details.reference_id);
        (_a = existing.detail).return_requested_quantity ?? (_a.return_requested_quantity = 0);
        existing.detail.return_requested_quantity = utils_1.MathBN.add(existing.detail.return_requested_quantity, action.details.quantity);
        return utils_1.MathBN.mult(existing.unit_price, action.details.quantity);
    },
    revert({ action, currentOrder }) {
        const existing = currentOrder.items.find((item) => item.id === action.details.reference_id);
        existing.detail.return_requested_quantity = utils_1.MathBN.sub(existing.detail.return_requested_quantity, action.details.quantity);
    },
    validate({ action, currentOrder }) {
        const refId = action.details?.reference_id;
        if (!(0, utils_1.isDefined)(refId)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Details reference ID is required.");
        }
        const existing = currentOrder.items.find((item) => item.id === refId);
        if (!existing) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Reference ID "${refId}" not found.`);
        }
        if (!action.details?.quantity) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Quantity to return of item ${refId} is required.`);
        }
        const quantityAvailable = utils_1.MathBN.sub(existing.detail?.shipped_quantity ?? 0, existing.detail?.return_requested_quantity ?? 0);
        const greater = utils_1.MathBN.gt(action.details?.quantity, quantityAvailable);
        if (greater) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Cannot request to return more items than what was shipped for item ${refId}.`);
        }
    },
});
//# sourceMappingURL=return-item.js.map