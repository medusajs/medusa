"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerGroupsGroupCustomers = exports.postCustomersCustomer = exports.getCustomersCustomer = exports.getCustomers = exports.postCustomers = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a Customer.
 * @summary Create a Customer
 */
var postCustomers = function (postCustomersBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customers",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomersBody,
    });
};
exports.postCustomers = postCustomers;
/**
 * Retrieves a list of Customers.
 * @summary List Customers
 */
var getCustomers = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/customers", method: "get" });
};
exports.getCustomers = getCustomers;
/**
 * Retrieves a Customer.
 * @summary Retrieve a Customer
 */
var getCustomersCustomer = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customers/".concat(id),
        method: "get",
    });
};
exports.getCustomersCustomer = getCustomersCustomer;
/**
 * Updates a Customer.
 * @summary Update a Customer
 */
var postCustomersCustomer = function (id, postCustomersCustomerBody, params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customers/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomersCustomerBody,
        params: params,
    });
};
exports.postCustomersCustomer = postCustomersCustomer;
/**
 * Retrieves a list of Customers.
 * @summary List Customers
 */
var getCustomerGroupsGroupCustomers = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customer-groups/".concat(id, "/customers"),
        method: "get",
    });
};
exports.getCustomerGroupsGroupCustomers = getCustomerGroupsGroupCustomers;
//# sourceMappingURL=customer.js.map