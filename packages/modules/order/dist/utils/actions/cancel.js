"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const action_key_1 = require("../action-key");
const calculate_order_change_1 = require("../calculate-order-change");
calculate_order_change_1.OrderChangeProcessing.registerActionType(action_key_1.ChangeActionType.CANCEL, {
    void: true,
});
//# sourceMappingURL=cancel.js.map