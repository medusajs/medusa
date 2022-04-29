"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postShippingOptionsOption = exports.getShippingOptionsOption = exports.deleteShippingOptionsOption = exports.getShippingOptions = exports.postShippingOptions = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a Shipping Option
 * @summary Create Shipping Option
 */
var postShippingOptions = function (postShippingOptionsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-options",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postShippingOptionsBody,
    });
};
exports.postShippingOptions = postShippingOptions;
/**
 * Retrieves a list of Shipping Options.
 * @summary List Shipping Options
 */
var getShippingOptions = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-options",
        method: "get",
        params: params,
    });
};
exports.getShippingOptions = getShippingOptions;
/**
 * Deletes a Shipping Option.
 * @summary Delete a Shipping Option
 */
var deleteShippingOptionsOption = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-options/".concat(id),
        method: "delete",
    });
};
exports.deleteShippingOptionsOption = deleteShippingOptionsOption;
/**
 * Retrieves a Shipping Option.
 * @summary Retrieve a Shipping Option
 */
var getShippingOptionsOption = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-options/".concat(id),
        method: "get",
    });
};
exports.getShippingOptionsOption = getShippingOptionsOption;
/**
 * Updates a Shipping Option
 * @summary Update Shipping Option
 */
var postShippingOptionsOption = function (id, postShippingOptionsOptionBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-options/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postShippingOptionsOptionBody,
    });
};
exports.postShippingOptionsOption = postShippingOptionsOption;
//# sourceMappingURL=shipping-option.js.map