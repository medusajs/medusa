"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDraftOrdersDraftOrder = exports.postDraftOrdersDraftOrderRegisterPayment = exports.postDraftOrdersDraftOrderLineItemsItem = exports.deleteDraftOrdersDraftOrderLineItemsItem = exports.getDraftOrdersDraftOrder = exports.deleteDraftOrdersDraftOrder = exports.postDraftOrdersDraftOrderLineItems = exports.getDraftOrders = exports.postDraftOrders = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a Draft Order
 * @summary Create a Draft Order
 */
var postDraftOrders = function (postDraftOrdersBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/draft-orders",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postDraftOrdersBody,
    });
};
exports.postDraftOrders = postDraftOrders;
/**
 * Retrieves an list of Draft Orders
 * @summary List Draft Orders
 */
var getDraftOrders = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/draft-orders",
        method: "get",
    });
};
exports.getDraftOrders = getDraftOrders;
/**
 * Creates a Line Item for the Draft Order
 * @summary Create a Line Item for Draft Order
 */
var postDraftOrdersDraftOrderLineItems = function (id, postDraftOrdersDraftOrderLineItemsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/draft-orders/".concat(id, "/line-items"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postDraftOrdersDraftOrderLineItemsBody,
    });
};
exports.postDraftOrdersDraftOrderLineItems = postDraftOrdersDraftOrderLineItems;
/**
 * Deletes a Draft Order
 * @summary Delete a Draft Order
 */
var deleteDraftOrdersDraftOrder = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/draft-orders/".concat(id),
        method: "delete",
    });
};
exports.deleteDraftOrdersDraftOrder = deleteDraftOrdersDraftOrder;
/**
 * Retrieves a Draft Order.
 * @summary Retrieve a Draft Order
 */
var getDraftOrdersDraftOrder = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/draft-orders/".concat(id),
        method: "get",
    });
};
exports.getDraftOrdersDraftOrder = getDraftOrdersDraftOrder;
/**
 * Removes a Line Item from a Draft Order.
 * @summary Delete a Line Item
 */
var deleteDraftOrdersDraftOrderLineItemsItem = function (id, lineId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/draft-orders/".concat(id, "/line-items/").concat(lineId),
        method: "delete",
    });
};
exports.deleteDraftOrdersDraftOrderLineItemsItem = deleteDraftOrdersDraftOrderLineItemsItem;
/**
 * Updates a Line Item for a Draft Order
 * @summary Update a Line Item for a Draft Order
 */
var postDraftOrdersDraftOrderLineItemsItem = function (id, lineId, postDraftOrdersDraftOrderLineItemsItemBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/draft-orders/".concat(id, "/line-items/").concat(lineId),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postDraftOrdersDraftOrderLineItemsItemBody,
    });
};
exports.postDraftOrdersDraftOrderLineItemsItem = postDraftOrdersDraftOrderLineItemsItem;
/**
 * Registers a payment for a Draft Order.
 * @summary Registers a payment for a Draft Order
 */
var postDraftOrdersDraftOrderRegisterPayment = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/draft-orders/".concat(id, "/register-payment"),
        method: "post",
    });
};
exports.postDraftOrdersDraftOrderRegisterPayment = postDraftOrdersDraftOrderRegisterPayment;
/**
 * Updates a Draft Order.
 * @summary Update a Draft Order"
 */
var postDraftOrdersDraftOrder = function (id, postDraftOrdersDraftOrderBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/admin/draft-orders/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postDraftOrdersDraftOrderBody,
    });
};
exports.postDraftOrdersDraftOrder = postDraftOrdersDraftOrder;
//# sourceMappingURL=draft-order.js.map