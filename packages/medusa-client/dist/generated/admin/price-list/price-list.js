"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postPriceListsPriceListPriceList = exports.getPriceLists = exports.getPriceListsPriceList = exports.deletePriceListsPriceList = exports.postPriceListsPriceList = exports.deletePriceListsPriceListPricesBatch = exports.postPriceListsPriceListPricesBatch = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Batch update prices for a Price List
 * @summary Batch update prices for a Price List
 */
var postPriceListsPriceListPricesBatch = function (id, postPriceListsPriceListPricesBatchBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/price-lists/".concat(id, "/prices/batch"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postPriceListsPriceListPricesBatchBody,
    });
};
exports.postPriceListsPriceListPricesBatch = postPriceListsPriceListPricesBatch;
/**
 * Batch delete prices that belongs to a Price List
 * @summary Batch delete prices that belongs to a Price List
 */
var deletePriceListsPriceListPricesBatch = function (id, deletePriceListsPriceListPricesBatchBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/price-lists/".concat(id, "/prices/batch"),
        method: "delete",
        headers: { "Content-Type": "application/json" },
        data: deletePriceListsPriceListPricesBatchBody,
    });
};
exports.deletePriceListsPriceListPricesBatch = deletePriceListsPriceListPricesBatch;
/**
 * Creates a Price List
 * @summary Creates a Price List
 */
var postPriceListsPriceList = function (postPriceListsPriceListBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/price_lists",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postPriceListsPriceListBody,
    });
};
exports.postPriceListsPriceList = postPriceListsPriceList;
/**
 * Deletes a Price List
 * @summary Delete a Price List
 */
var deletePriceListsPriceList = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/price-lists/".concat(id),
        method: "delete",
    });
};
exports.deletePriceListsPriceList = deletePriceListsPriceList;
/**
 * Retrieves a Price List.
 * @summary Retrieve a Price List
 */
var getPriceListsPriceList = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/price-lists/".concat(id),
        method: "get",
    });
};
exports.getPriceListsPriceList = getPriceListsPriceList;
/**
 * Retrieves a list of Price Lists.
 * @summary List Price Lists
 */
var getPriceLists = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/price-lists",
        method: "get",
    });
};
exports.getPriceLists = getPriceLists;
/**
 * Updates a Price List
 * @summary Update a Price List
 */
var postPriceListsPriceListPriceList = function (id, postPriceListsPriceListPriceListBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/price_lists/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postPriceListsPriceListPriceListBody,
    });
};
exports.postPriceListsPriceListPriceList = postPriceListsPriceListPriceList;
//# sourceMappingURL=price-list.js.map