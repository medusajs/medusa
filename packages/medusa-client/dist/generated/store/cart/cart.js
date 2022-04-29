"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCartsCart = exports.postCartsCartPaymentSession = exports.postCartsCartPaymentSessionsSession = exports.getCartsCart = exports.postCartsCartPaymentSessionUpdate = exports.deleteCartsCartPaymentSessionsSession = exports.postCartsCartLineItemsItem = exports.deleteCartsCartLineItemsItem = exports.deleteCartsCartDiscountsDiscount = exports.postCartsCartPaymentSessions = exports.postCartsCartLineItems = exports.postCart = exports.postCartsCartComplete = exports.postCartsCartTaxes = exports.postCartsCartShippingMethod = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Adds a Shipping Method to the Cart.
 * @summary Add a Shipping Method
 */
var postCartsCartShippingMethod = function (id, postCartsCartShippingMethodBody) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/shipping-methods"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCartsCartShippingMethodBody,
    });
};
exports.postCartsCartShippingMethod = postCartsCartShippingMethod;
/**
 * Calculates taxes for a cart. Depending on the cart's region this may involve making 3rd party API calls to a Tax Provider service.
 * @summary Calculate Cart Taxes
 */
var postCartsCartTaxes = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/taxes"),
        method: "post",
    });
};
exports.postCartsCartTaxes = postCartsCartTaxes;
/**
 * Completes a cart. The following steps will be performed. Payment authorization is attempted and if more work is required, we simply return the cart for further updates. If payment is authorized and order is not yet created, we make sure to do so. The completion of a cart can be performed idempotently with a provided header `Idempotency-Key`. If not provided, we will generate one for the request.
 * @summary Complete a Cart
 */
var postCartsCartComplete = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/complete"),
        method: "post",
    });
};
exports.postCartsCartComplete = postCartsCartComplete;
/**
 * Creates a Cart within the given region and with the initial items. If no `region_id` is provided the cart will be associated with the first Region available. If no items are provided the cart will be empty after creation. If a user is logged in the cart's customer id and email will be set.
 * @summary Create a Cart
 */
var postCart = function (postCartBody) {
    return (0, custom_instance_1.getClient)({
        url: "/carts",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCartBody,
    });
};
exports.postCart = postCart;
/**
 * Generates a Line Item with a given Product Variant and adds it to the Cart
 * @summary Add a Line Item
 */
var postCartsCartLineItems = function (id, postCartsCartLineItemsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/line-items"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCartsCartLineItemsBody,
    });
};
exports.postCartsCartLineItems = postCartsCartLineItems;
/**
 * Creates Payment Sessions for each of the available Payment Providers in the Cart's Region.
 * @summary Initialize Payment Sessions
 */
var postCartsCartPaymentSessions = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/payment-sessions"),
        method: "post",
    });
};
exports.postCartsCartPaymentSessions = postCartsCartPaymentSessions;
/**
 * Removes a Discount from a Cart.
 * @summary Remove Discount from Cart
 */
var deleteCartsCartDiscountsDiscount = function (id, code) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/discounts/").concat(code),
        method: "delete",
    });
};
exports.deleteCartsCartDiscountsDiscount = deleteCartsCartDiscountsDiscount;
/**
 * Removes a Line Item from a Cart.
 * @summary Delete a Line Item
 */
var deleteCartsCartLineItemsItem = function (id, lineId) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/line-items/").concat(lineId),
        method: "delete",
    });
};
exports.deleteCartsCartLineItemsItem = deleteCartsCartLineItemsItem;
/**
 * Updates a Line Item if the desired quantity can be fulfilled.
 * @summary Update a Line Item
 */
var postCartsCartLineItemsItem = function (id, lineId, postCartsCartLineItemsItemBody) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/line-items/").concat(lineId),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCartsCartLineItemsItemBody,
    });
};
exports.postCartsCartLineItemsItem = postCartsCartLineItemsItem;
/**
 * Deletes a Payment Session on a Cart. May be useful if a payment has failed.
 * @summary Delete a Payment Session
 */
var deleteCartsCartPaymentSessionsSession = function (id, providerId) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/payment-sessions/").concat(providerId),
        method: "delete",
    });
};
exports.deleteCartsCartPaymentSessionsSession = deleteCartsCartPaymentSessionsSession;
/**
 * Updates a Payment Session with additional data.
 * @summary Update a Payment Session
 */
var postCartsCartPaymentSessionUpdate = function (id, providerId, postCartsCartPaymentSessionUpdateBody) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/payment-sessions/").concat(providerId),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCartsCartPaymentSessionUpdateBody,
    });
};
exports.postCartsCartPaymentSessionUpdate = postCartsCartPaymentSessionUpdate;
/**
 * Retrieves a Cart.
 * @summary Retrieve a Cart
 */
var getCartsCart = function (id) {
    return (0, custom_instance_1.getClient)({ url: "/carts/".concat(id), method: "get" });
};
exports.getCartsCart = getCartsCart;
/**
 * Refreshes a Payment Session to ensure that it is in sync with the Cart - this is usually not necessary.
 * @summary Refresh a Payment Session
 */
var postCartsCartPaymentSessionsSession = function (id, providerId) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/payment-sessions/").concat(providerId, "/refresh"),
        method: "post",
    });
};
exports.postCartsCartPaymentSessionsSession = postCartsCartPaymentSessionsSession;
/**
 * Selects a Payment Session as the session intended to be used towards the completion of the Cart.
 * @summary Select a Payment Session
 */
var postCartsCartPaymentSession = function (id, postCartsCartPaymentSessionBody) {
    return (0, custom_instance_1.getClient)({
        url: "/carts/".concat(id, "/payment-session"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCartsCartPaymentSessionBody,
    });
};
exports.postCartsCartPaymentSession = postCartsCartPaymentSession;
/**
 * Updates a Cart.
 * @summary Update a Cart"
 */
var postCartsCart = function (id, postCartsCartBody) {
    return (0, custom_instance_1.getClient)({
        url: "/store/carts/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCartsCartBody,
    });
};
exports.postCartsCart = postCartsCart;
//# sourceMappingURL=cart.js.map