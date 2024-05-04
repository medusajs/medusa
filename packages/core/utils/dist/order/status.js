"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderChangeStatus = exports.OrderStatus = void 0;
/**
 * @enum
 *
 * The order's status.
 */
var OrderStatus;
(function (OrderStatus) {
    /**
     * The order is pending.
     */
    OrderStatus["PENDING"] = "pending";
    /**
     * The order is completed
     */
    OrderStatus["COMPLETED"] = "completed";
    /**
     * The order is a draft.
     */
    OrderStatus["DRAFT"] = "draft";
    /**
     * The order is archived.
     */
    OrderStatus["ARCHIVED"] = "archived";
    /**
     * The order is canceled.
     */
    OrderStatus["CANCELED"] = "canceled";
    /**
     * The order requires action.
     */
    OrderStatus["REQUIRES_ACTION"] = "requires_action";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
/**
 * @enum
 *
 * The order change's status.
 */
var OrderChangeStatus;
(function (OrderChangeStatus) {
    /**
     * The order change is confirmed.
     */
    OrderChangeStatus["CONFIRMED"] = "confirmed";
    /**
     * The order change is declined.
     */
    OrderChangeStatus["DECLINED"] = "declined";
    /**
     * The order change is requested.
     */
    OrderChangeStatus["REQUESTED"] = "requested";
    /**
     * The order change is pending.
     */
    OrderChangeStatus["PENDING"] = "pending";
    /**
     * The order change is canceled.
     */
    OrderChangeStatus["CANCELED"] = "canceled";
})(OrderChangeStatus || (exports.OrderChangeStatus = OrderChangeStatus = {}));
//# sourceMappingURL=status.js.map