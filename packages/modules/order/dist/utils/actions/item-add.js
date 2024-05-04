"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const action_key_1 = require("../action-key");
const calculate_order_change_1 = require("../calculate-order-change");
calculate_order_change_1.OrderChangeProcessing.registerActionType(action_key_1.ChangeActionType.ITEM_ADD, {
    operation({ action, currentOrder }) {
        var _a;
        const existing = currentOrder.items.find((item) => item.id === action.reference_id);
        if (existing) {
            (_a = existing.detail).quantity ?? (_a.quantity = 0);
            existing.quantity = utils_1.MathBN.add(existing.quantity, action.details.quantity);
            existing.detail.quantity = utils_1.MathBN.add(existing.detail.quantity, action.details.quantity);
        }
        else {
            currentOrder.items.push({
                id: action.reference_id,
                unit_price: action.details.unit_price,
                quantity: action.details.quantity,
            });
        }
        return utils_1.MathBN.mult(action.details.unit_price, action.details.quantity);
    },
    revert({ action, currentOrder }) {
        const existingIndex = currentOrder.items.findIndex((item) => item.id === action.reference_id);
        if (existingIndex > -1) {
            const existing = currentOrder.items[existingIndex];
            existing.quantity = utils_1.MathBN.sub(existing.quantity, action.details.quantity);
            existing.detail.quantity = utils_1.MathBN.sub(existing.detail.quantity, action.details.quantity);
            if (utils_1.MathBN.lte(existing.quantity, 0)) {
                currentOrder.items.splice(existingIndex, 1);
            }
        }
    },
    validate({ action }) {
        const refId = action.reference_id;
        if (!(0, utils_1.isDefined)(action.reference_id)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Reference ID is required.");
        }
        if (!(0, utils_1.isDefined)(action.amount) && !(0, utils_1.isDefined)(action.details?.unit_price)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Unit price of item ${refId} is required if no action.amount is provided.`);
        }
        if (!action.details?.quantity) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Quantity of item ${refId} is required.`);
        }
        if (utils_1.MathBN.lt(action.details?.quantity, 1)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Quantity of item ${refId} must be greater than 0.`);
        }
    },
});
//# sourceMappingURL=item-add.js.map