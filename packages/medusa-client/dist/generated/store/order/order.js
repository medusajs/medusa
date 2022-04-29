"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.getOrdersOrder = exports.getOrdersOrderCartId = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves an Order by the id of the Cart that was used to create the Order.
 * @summary Retrieves Order by Cart id
 */
var getOrdersOrderCartId = function (cartId) {
    return (0, custom_instance_1.getClient)({
        url: "/orders/cart/".concat(cartId),
        method: "get",
    });
};
exports.getOrdersOrderCartId = getOrdersOrderCartId;
/**
 * Retrieves an Order
 * @summary Retrieves an Order
 */
var getOrdersOrder = function (id) {
    return (0, custom_instance_1.getClient)({ url: "/orders/".concat(id), method: "get" });
};
exports.getOrdersOrder = getOrdersOrder;
/**
 * Looks for an Order with a given `display_id`, `email` pair. The `display_id`, `email` pair must match in order for the Order to be returned.
 * @summary Look Up an Order
 */
var getOrders = function (params) {
    return (0, custom_instance_1.getClient)({ url: "/orders", method: "get", params: params });
};
exports.getOrders = getOrders;
//# sourceMappingURL=order.js.map