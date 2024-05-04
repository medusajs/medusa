"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const _types_1 = require("../../types");
const action_key_1 = require("../action-key");
const calculate_order_change_1 = require("../calculate-order-change");
calculate_order_change_1.OrderChangeProcessing.registerActionType(action_key_1.ChangeActionType.RECEIVE_RETURN_ITEM, {
    isDeduction: true,
    commitsAction: "return_item",
    operation({ action, currentOrder, previousEvents }) {
        var _a, _b;
        const existing = currentOrder.items.find((item) => item.id === action.details.reference_id);
        let toReturn = action.details.quantity;
        (_a = existing.detail).return_received_quantity ?? (_a.return_received_quantity = 0);
        (_b = existing.detail).return_requested_quantity ?? (_b.return_requested_quantity = 0);
        existing.detail.return_received_quantity = utils_1.MathBN.add(existing.detail.return_received_quantity, toReturn);
        existing.detail.return_requested_quantity = utils_1.MathBN.sub(existing.detail.return_requested_quantity, toReturn);
        if (previousEvents) {
            for (const previousEvent of previousEvents) {
                previousEvent.original_ = JSON.parse(JSON.stringify(previousEvent));
                let ret = utils_1.MathBN.min(toReturn, previousEvent.details.quantity);
                toReturn = utils_1.MathBN.sub(toReturn, ret);
                previousEvent.details.quantity = utils_1.MathBN.sub(previousEvent.details.quantity, ret);
                if (utils_1.MathBN.lte(previousEvent.details.quantity, 0)) {
                    previousEvent.status = _types_1.EVENT_STATUS.DONE;
                }
            }
        }
        return utils_1.MathBN.mult(existing.unit_price, action.details.quantity);
    },
    revert({ action, currentOrder, previousEvents }) {
        const existing = currentOrder.items.find((item) => item.id === action.details.reference_id);
        existing.detail.return_received_quantity = utils_1.MathBN.sub(existing.detail.return_received_quantity, action.details.quantity);
        existing.detail.return_requested_quantity = utils_1.MathBN.add(existing.detail.return_requested_quantity, action.details.quantity);
        if (previousEvents) {
            for (const previousEvent of previousEvents) {
                if (!previousEvent.original_) {
                    continue;
                }
                previousEvent.details = JSON.parse(JSON.stringify(previousEvent.original_.details));
                (0, utils_1.transformPropertiesToBigNumber)(previousEvent.details?.metadata);
                delete previousEvent.original_;
                previousEvent.status = _types_1.EVENT_STATUS.PENDING;
            }
        }
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
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Quantity to receive return of item ${refId} is required.`);
        }
        const quantityRequested = existing?.detail?.return_requested_quantity || 0;
        const greater = utils_1.MathBN.gt(action.details?.quantity, quantityRequested);
        if (greater) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Cannot receive more items than what was requested to be returned for item ${refId}.`);
        }
    },
});
//# sourceMappingURL=receive-return-item.js.map