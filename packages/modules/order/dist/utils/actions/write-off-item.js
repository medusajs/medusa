"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const action_key_1 = require("../action-key");
const calculate_order_change_1 = require("../calculate-order-change");
calculate_order_change_1.OrderChangeProcessing.registerActionType(action_key_1.ChangeActionType.WRITE_OFF_ITEM, {
    operation({ action, currentOrder }) {
        var _a;
        const existing = currentOrder.items.find((item) => item.id === action.details.reference_id);
        (_a = existing.detail).written_off_quantity ?? (_a.written_off_quantity = 0);
        existing.detail.written_off_quantity = utils_1.MathBN.add(existing.detail.written_off_quantity, action.details.quantity);
    },
    revert({ action, currentOrder }) {
        const existing = currentOrder.items.find((item) => item.id === action.details.reference_id);
        existing.detail.written_off_quantity = utils_1.MathBN.sub(existing.detail.written_off_quantity, action.details.quantity);
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
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Quantity to write-off item ${refId} is required.`);
        }
        const quantityAvailable = existing.quantity ?? 0;
        const greater = utils_1.MathBN.gt(action.details?.quantity, quantityAvailable);
        if (greater) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Cannot claim more items than what was ordered.");
        }
    },
});
//# sourceMappingURL=write-off-item.js.map