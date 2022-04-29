"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCustomersResetPassword = exports.postCustomersCustomerPasswordToken = exports.getCustomersCustomerOrders = exports.getCustomersCustomerPaymentMethods = exports.postCustomersCustomer = exports.getCustomersCustomer = exports.postCustomersCustomerAddressesAddress = exports.deleteCustomersCustomerAddressesAddress = exports.postCustomers = exports.postCustomersCustomerAddresses = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Adds a Shipping Address to a Customer's saved addresses.
 * @summary Add a Shipping Address
 */
var postCustomersCustomerAddresses = function (postCustomersCustomerAddressesBody) {
    return (0, custom_instance_1.getClient)({
        url: "/customers/me/addresses",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomersCustomerAddressesBody,
    });
};
exports.postCustomersCustomerAddresses = postCustomersCustomerAddresses;
/**
 * Creates a Customer account.
 * @summary Create a Customer
 */
var postCustomers = function (postCustomersBody) {
    return (0, custom_instance_1.getClient)({
        url: "/customers",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomersBody,
    });
};
exports.postCustomers = postCustomers;
/**
 * Removes an Address from the Customer's saved addresse.
 * @summary Delete an Address
 */
var deleteCustomersCustomerAddressesAddress = function (addressId) {
    return (0, custom_instance_1.getClient)({
        url: "/customers/me/addresses/".concat(addressId),
        method: "delete",
    });
};
exports.deleteCustomersCustomerAddressesAddress = deleteCustomersCustomerAddressesAddress;
/**
 * Updates a Customer's saved Shipping Address.
 * @summary Update a Shipping Address
 */
var postCustomersCustomerAddressesAddress = function (addressId, postCustomersCustomerAddressesAddressBody) {
    return (0, custom_instance_1.getClient)({
        url: "/customers/me/addresses/".concat(addressId),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomersCustomerAddressesAddressBody,
    });
};
exports.postCustomersCustomerAddressesAddress = postCustomersCustomerAddressesAddress;
/**
 * Retrieves a Customer - the Customer must be logged in to retrieve their details.
 * @summary Retrieves a Customer
 */
var getCustomersCustomer = function () {
    return (0, custom_instance_1.getClient)({
        url: "/customers/me",
        method: "get",
    });
};
exports.getCustomersCustomer = getCustomersCustomer;
/**
 * Updates a Customer's saved details.
 * @summary Update Customer details
 */
var postCustomersCustomer = function (postCustomersCustomerBody) {
    return (0, custom_instance_1.getClient)({
        url: "/customers/me",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomersCustomerBody,
    });
};
exports.postCustomersCustomer = postCustomersCustomer;
/**
 * Retrieves a list of a Customer's saved payment methods. Payment methods are saved with Payment Providers and it is their responsibility to fetch saved methods.
 * @summary Retrieve saved payment methods
 */
var getCustomersCustomerPaymentMethods = function () {
    return (0, custom_instance_1.getClient)({
        url: "/customers/me/payment-methods",
        method: "get",
    });
};
exports.getCustomersCustomerPaymentMethods = getCustomersCustomerPaymentMethods;
/**
 * Retrieves a list of a Customer's Orders.
 * @summary Retrieve Customer Orders
 */
var getCustomersCustomerOrders = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/customers/me/orders",
        method: "get",
        params: params,
    });
};
exports.getCustomersCustomerOrders = getCustomersCustomerOrders;
/**
 * Creates a reset password token to be used in a subsequent /reset-password request. The password token should be sent out of band e.g. via email and will not be returned.
 * @summary Creates a reset password token
 */
var postCustomersCustomerPasswordToken = function (postCustomersCustomerPasswordTokenBody) {
    return (0, custom_instance_1.getClient)({
        url: "/customers/password-token",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomersCustomerPasswordTokenBody,
    });
};
exports.postCustomersCustomerPasswordToken = postCustomersCustomerPasswordToken;
/**
 * Resets a Customer's password using a password token created by a previous /password-token request.
 * @summary Resets Customer password
 */
var postCustomersResetPassword = function (postCustomersResetPasswordBody) {
    return (0, custom_instance_1.getClient)({
        url: "/customers/reset-password",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomersResetPasswordBody,
    });
};
exports.postCustomersResetPassword = postCustomersResetPassword;
//# sourceMappingURL=customer.js.map