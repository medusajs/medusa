"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCustomerGroupsGroup = exports.getCustomerGroupsGroup = exports.deleteCustomerGroupsCustomerGroup = exports.getCustomerGroups = exports.postCustomerGroups = exports.deleteCustomerGroupsGroupCustomerBatch = exports.postCustomerGroupsGroupCustomersBatch = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Adds a list of customers, represented by id's, to a customer group.
 * @summary Add a list of customers to a customer group
 */
var postCustomerGroupsGroupCustomersBatch = function (id, postCustomerGroupsGroupCustomersBatchBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customer-groups/".concat(id, "/customers/batch"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomerGroupsGroupCustomersBatchBody,
    });
};
exports.postCustomerGroupsGroupCustomersBatch = postCustomerGroupsGroupCustomersBatch;
/**
 * Removes a list of customers, represented by id's, from a customer group.
 * @summary Remove a list of customers from a customer group
 */
var deleteCustomerGroupsGroupCustomerBatch = function (id, deleteCustomerGroupsGroupCustomerBatchBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customer-groups/".concat(id, "/customers/batch"),
        method: "delete",
        headers: { "Content-Type": "application/json" },
        data: deleteCustomerGroupsGroupCustomerBatchBody,
    });
};
exports.deleteCustomerGroupsGroupCustomerBatch = deleteCustomerGroupsGroupCustomerBatch;
/**
 * Creates a CustomerGroup.
 * @summary Create a CustomerGroup
 */
var postCustomerGroups = function (postCustomerGroupsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customer-groups",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomerGroupsBody,
    });
};
exports.postCustomerGroups = postCustomerGroups;
/**
 * Retrieve a list of customer groups.
 * @summary Retrieve a list of customer groups
 */
var getCustomerGroups = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customer-groups",
        method: "get",
        params: params,
    });
};
exports.getCustomerGroups = getCustomerGroups;
/**
 * Deletes a CustomerGroup.
 * @summary Delete a CustomerGroup
 */
var deleteCustomerGroupsCustomerGroup = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customer-groups/".concat(id),
        method: "delete",
    });
};
exports.deleteCustomerGroupsCustomerGroup = deleteCustomerGroupsCustomerGroup;
/**
 * Retrieves a Customer Group.
 * @summary Retrieve a CustomerGroup
 */
var getCustomerGroupsGroup = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customer-groups/".concat(id),
        method: "get",
    });
};
exports.getCustomerGroupsGroup = getCustomerGroupsGroup;
/**
 * Update a CustomerGroup.
 * @summary Update a CustomerGroup
 */
var postCustomerGroupsGroup = function (id, postCustomerGroupsGroupBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/customer-groups/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCustomerGroupsGroupBody,
    });
};
exports.postCustomerGroupsGroup = postCustomerGroupsGroup;
//# sourceMappingURL=customer-group.js.map