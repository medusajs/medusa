"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaxRates = exports.postOrdersOrderClaimsClaim = exports.postOrdersOrderReturns = exports.postOrdersOrderRefunds = exports.postOrdersOrderSwapsSwapProcessPayment = exports.postOrdersOrder = exports.getOrdersOrder = exports.postOrdersOrderSwapsSwapFulfillments = exports.postOrdersOrderClaimsClaimFulfillments = exports.deleteOrdersOrderMetadataKey = exports.postOrdersOrderSwaps = exports.postOrdersOrderSwapsSwapShipments = exports.postOrdersOrderShipment = exports.getOrders = exports.postOrders = exports.postOrdersOrderFulfillments = exports.postOrdersOrderClaims = exports.postOrdersOrderClaimsClaimShipments = exports.postOrdersOrderComplete = exports.postOrdersOrderCapture = exports.postOrdersOrderCancel = exports.postOrdersOrderArchive = exports.postOrdersOrderShippingMethods = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Adds a Shipping Method to an Order. If another Shipping Method exists with the same Shipping Profile, the previous Shipping Method will be replaced.
 * @summary Add a Shipping Method
 */
var postOrdersOrderShippingMethods = function (id, postOrdersOrderShippingMethodsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/shipping-methods"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderShippingMethodsBody,
    });
};
exports.postOrdersOrderShippingMethods = postOrdersOrderShippingMethods;
/**
 * Archives the order with the given id.
 * @summary Archive order
 */
var postOrdersOrderArchive = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/archive"),
        method: "post",
    });
};
exports.postOrdersOrderArchive = postOrdersOrderArchive;
/**
 * Registers an Order as canceled. This triggers a flow that will cancel any created Fulfillments and Payments, may fail if the Payment or Fulfillment Provider is unable to cancel the Payment/Fulfillment.
 * @summary Cancel an Order
 */
var postOrdersOrderCancel = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/cancel"),
        method: "post",
    });
};
exports.postOrdersOrderCancel = postOrdersOrderCancel;
/**
 * Captures all the Payments associated with an Order.
 * @summary Capture an Order
 */
var postOrdersOrderCapture = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/capture"),
        method: "post",
    });
};
exports.postOrdersOrderCapture = postOrdersOrderCapture;
/**
 * Completes an Order
 * @summary Complete an Order
 */
var postOrdersOrderComplete = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/complete"),
        method: "post",
    });
};
exports.postOrdersOrderComplete = postOrdersOrderComplete;
/**
 * Registers a Claim Fulfillment as shipped.
 * @summary Create Claim Shipment
 */
var postOrdersOrderClaimsClaimShipments = function (id, claimId, postOrdersOrderClaimsClaimShipmentsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/claims/").concat(claimId, "/shipments"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderClaimsClaimShipmentsBody,
    });
};
exports.postOrdersOrderClaimsClaimShipments = postOrdersOrderClaimsClaimShipments;
/**
 * Creates a Claim.
 * @summary Create a Claim
 */
var postOrdersOrderClaims = function (id, postOrdersOrderClaimsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/order/".concat(id, "/claims"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderClaimsBody,
    });
};
exports.postOrdersOrderClaims = postOrdersOrderClaims;
/**
 * Creates a Fulfillment of an Order - will notify Fulfillment Providers to prepare a shipment.
 * @summary Create a Fulfillment
 */
var postOrdersOrderFulfillments = function (id, postOrdersOrderFulfillmentsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/fulfillments"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderFulfillmentsBody,
    });
};
exports.postOrdersOrderFulfillments = postOrdersOrderFulfillments;
/**
 * Creates and order
 * @summary Create an order
 */
var postOrders = function (postOrdersBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersBody,
    });
};
exports.postOrders = postOrders;
/**
 * Retrieves a list of Orders
 * @summary List Orders
 */
var getOrders = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders",
        method: "get",
        params: params,
    });
};
exports.getOrders = getOrders;
/**
 * Registers a Fulfillment as shipped.
 * @summary Create a Shipment
 */
var postOrdersOrderShipment = function (id, postOrdersOrderShipmentBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/shipment"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderShipmentBody,
    });
};
exports.postOrdersOrderShipment = postOrdersOrderShipment;
/**
 * Registers a Swap Fulfillment as shipped.
 * @summary Create Swap Shipment
 */
var postOrdersOrderSwapsSwapShipments = function (id, swapId, postOrdersOrderSwapsSwapShipmentsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/swaps/").concat(swapId, "/shipments"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderSwapsSwapShipmentsBody,
    });
};
exports.postOrdersOrderSwapsSwapShipments = postOrdersOrderSwapsSwapShipments;
/**
 * Creates a Swap. Swaps are used to handle Return of previously purchased goods and Fulfillment of replacements simultaneously.
 * @summary Create a Swap
 */
var postOrdersOrderSwaps = function (id, postOrdersOrderSwapsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/order/".concat(id, "/swaps"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderSwapsBody,
    });
};
exports.postOrdersOrderSwaps = postOrdersOrderSwaps;
/**
 * Deletes a metadata key.
 * @summary Delete Metadata
 */
var deleteOrdersOrderMetadataKey = function (id, key) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/order/".concat(id, "/metadata/").concat(key),
        method: "delete",
    });
};
exports.deleteOrdersOrderMetadataKey = deleteOrdersOrderMetadataKey;
/**
 * Creates a Fulfillment for a Claim.
 * @summary Create a Claim Fulfillment
 */
var postOrdersOrderClaimsClaimFulfillments = function (id, claimId, postOrdersOrderClaimsClaimFulfillmentsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/claims/").concat(claimId, "/fulfillments"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderClaimsClaimFulfillmentsBody,
    });
};
exports.postOrdersOrderClaimsClaimFulfillments = postOrdersOrderClaimsClaimFulfillments;
/**
 * Creates a Fulfillment for a Swap.
 * @summary Create a Swap Fulfillment
 */
var postOrdersOrderSwapsSwapFulfillments = function (id, swapId, postOrdersOrderSwapsSwapFulfillmentsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/swaps/").concat(swapId, "/fulfillments"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderSwapsSwapFulfillmentsBody,
    });
};
exports.postOrdersOrderSwapsSwapFulfillments = postOrdersOrderSwapsSwapFulfillments;
/**
 * Retrieves an Order
 * @summary Retrieve an Order
 */
var getOrdersOrder = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id),
        method: "get",
    });
};
exports.getOrdersOrder = getOrdersOrder;
/**
 * Updates and order
 * @summary Update an order
 */
var postOrdersOrder = function (id, postOrdersOrderBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderBody,
    });
};
exports.postOrdersOrder = postOrdersOrder;
/**
 * When there are differences between the returned and shipped Products in a Swap, the difference must be processed. Either a Refund will be issued or a Payment will be captured.
 * @summary Process a Swap difference
 */
var postOrdersOrderSwapsSwapProcessPayment = function (id, swapId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/swaps/").concat(swapId, "/process-payment"),
        method: "post",
    });
};
exports.postOrdersOrderSwapsSwapProcessPayment = postOrdersOrderSwapsSwapProcessPayment;
/**
 * Issues a Refund.
 * @summary Create a Refund
 */
var postOrdersOrderRefunds = function (id, postOrdersOrderRefundsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/refunds"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderRefundsBody,
    });
};
exports.postOrdersOrderRefunds = postOrdersOrderRefunds;
/**
 * Requests a Return. If applicable a return label will be created and other plugins notified.
 * @summary Request a Return
 */
var postOrdersOrderReturns = function (id, postOrdersOrderReturnsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/returns"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderReturnsBody,
    });
};
exports.postOrdersOrderReturns = postOrdersOrderReturns;
/**
 * Updates a Claim.
 * @summary Update a Claim
 */
var postOrdersOrderClaimsClaim = function (id, claimId, postOrdersOrderClaimsClaimBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/order/".concat(id, "/claims/").concat(claimId),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postOrdersOrderClaimsClaimBody,
    });
};
exports.postOrdersOrderClaimsClaim = postOrdersOrderClaimsClaim;
/**
 * Retrieves a list of TaxRates
 * @summary List Tax Rates
 */
var getTaxRates = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates",
        method: "get",
        params: params,
    });
};
exports.getTaxRates = getTaxRates;
//# sourceMappingURL=order.js.map