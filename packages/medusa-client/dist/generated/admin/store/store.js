"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreTaxProviders = exports.getStorePaymentProviders = exports.postStore = exports.getStore = exports.deleteStoreCurrenciesCode = exports.postStoreCurrenciesCode = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Adds a Currency Code to the available currencies.
 * @summary Add a Currency Code
 */
var postStoreCurrenciesCode = function (code) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/store/currencies/".concat(code),
        method: "post",
    });
};
exports.postStoreCurrenciesCode = postStoreCurrenciesCode;
/**
 * Removes a Currency Code from the available currencies.
 * @summary Remove a Currency Code
 */
var deleteStoreCurrenciesCode = function (code) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/store/currencies/".concat(code),
        method: "delete",
    });
};
exports.deleteStoreCurrenciesCode = deleteStoreCurrenciesCode;
/**
 * Retrieves the Store details
 * @summary Retrieve Store details.
 */
var getStore = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/store", method: "get" });
};
exports.getStore = getStore;
/**
 * Updates the Store details
 * @summary Update Store details.
 */
var postStore = function (postStoreBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/store",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postStoreBody,
    });
};
exports.postStore = postStore;
/**
 * Retrieves the configured Payment Providers
 * @summary Retrieve configured Payment Providers
 */
var getStorePaymentProviders = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/store/payment-providers",
        method: "get",
    });
};
exports.getStorePaymentProviders = getStorePaymentProviders;
/**
 * Retrieves the configured Tax Providers
 * @summary Retrieve configured Tax Providers
 */
var getStoreTaxProviders = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/store/tax-providers",
        method: "get",
    });
};
exports.getStoreTaxProviders = getStoreTaxProviders;
//# sourceMappingURL=store.js.map