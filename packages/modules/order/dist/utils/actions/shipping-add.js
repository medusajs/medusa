"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const action_key_1 = require("../action-key");
const calculate_order_change_1 = require("../calculate-order-change");
calculate_order_change_1.OrderChangeProcessing.registerActionType(action_key_1.ChangeActionType.SHIPPING_ADD, {
    operation({ action, currentOrder }) {
        const shipping = Array.isArray(currentOrder.shipping_methods)
            ? currentOrder.shipping_methods
            : [currentOrder.shipping_methods];
        shipping.push({
            id: action.reference_id,
            price: action.amount,
        });
        currentOrder.shipping_methods = shipping;
    },
    revert({ action, currentOrder }) {
        const shipping = Array.isArray(currentOrder.shipping_methods)
            ? currentOrder.shipping_methods
            : [currentOrder.shipping_methods];
        const existingIndex = shipping.findIndex((item) => item.id === action.reference_id);
        if (existingIndex > -1) {
            shipping.splice(existingIndex, 1);
        }
    },
    validate({ action }) {
        if (!action.reference_id) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Reference ID is required.");
        }
        if (!(0, utils_1.isDefined)(action.amount)) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Amount is required.");
        }
    },
});
//# sourceMappingURL=shipping-add.js.map