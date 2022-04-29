"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscountsDiscountCode = exports.deleteDiscountsDiscountDynamicCodesCode = exports.postDiscountsDiscount = exports.getDiscountsDiscount = exports.deleteDiscountsDiscount = exports.postDiscountsDiscountDynamicCodes = exports.getDiscounts = exports.postDiscounts = exports.deleteDiscountsDiscountRegionsRegion = exports.postDiscountsDiscountRegionsRegion = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Adds a Region to the list of Regions that a Discount can be used in.
 * @summary Adds Region availability
 */
var postDiscountsDiscountRegionsRegion = function (id, regionId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts/".concat(id, "/regions/").concat(regionId),
        method: "post",
    });
};
exports.postDiscountsDiscountRegionsRegion = postDiscountsDiscountRegionsRegion;
/**
 * Removes a Region from the list of Regions that a Discount can be used in.
 * @summary Remove Region availability
 */
var deleteDiscountsDiscountRegionsRegion = function (id, regionId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts/".concat(id, "/regions/").concat(regionId),
        method: "delete",
    });
};
exports.deleteDiscountsDiscountRegionsRegion = deleteDiscountsDiscountRegionsRegion;
/**
 * Creates a Discount with a given set of rules that define how the Discount behaves.
 * @summary Creates a Discount
 */
var postDiscounts = function (postDiscountsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postDiscountsBody,
    });
};
exports.postDiscounts = postDiscounts;
/**
 * Retrieves a list of Discounts
 * @summary List Discounts
 */
var getDiscounts = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts",
        method: "get",
        params: params,
    });
};
exports.getDiscounts = getDiscounts;
/**
 * Creates a unique code that can map to a parent Discount. This is useful if you want to automatically generate codes with the same behaviour.
 * @summary Create a dynamic Discount code
 */
var postDiscountsDiscountDynamicCodes = function (id, postDiscountsDiscountDynamicCodesBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts/".concat(id, "/dynamic-codes"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postDiscountsDiscountDynamicCodesBody,
    });
};
exports.postDiscountsDiscountDynamicCodes = postDiscountsDiscountDynamicCodes;
/**
 * Deletes a Discount.
 * @summary Delete a Discount
 */
var deleteDiscountsDiscount = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts/".concat(id),
        method: "delete",
    });
};
exports.deleteDiscountsDiscount = deleteDiscountsDiscount;
/**
 * Retrieves a Discount
 * @summary Retrieve a Discount
 */
var getDiscountsDiscount = function (id, params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts/".concat(id),
        method: "get",
        params: params,
    });
};
exports.getDiscountsDiscount = getDiscountsDiscount;
/**
 * Updates a Discount with a given set of rules that define how the Discount behaves.
 * @summary Update a Discount
 */
var postDiscountsDiscount = function (id, postDiscountsDiscountBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postDiscountsDiscountBody,
    });
};
exports.postDiscountsDiscount = postDiscountsDiscount;
/**
 * Deletes a dynamic code from a Discount.
 * @summary Delete a dynamic code
 */
var deleteDiscountsDiscountDynamicCodesCode = function (id, code) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts/".concat(id, "/dynamic-codes/").concat(code),
        method: "delete",
    });
};
exports.deleteDiscountsDiscountDynamicCodesCode = deleteDiscountsDiscountDynamicCodesCode;
/**
 * Retrieves a Discount by its discount code
 * @summary Retrieve a Discount by code
 */
var getDiscountsDiscountCode = function (code) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/discounts/code/".concat(code),
        method: "get",
    });
};
exports.getDiscountsDiscountCode = getDiscountsDiscountCode;
//# sourceMappingURL=discount.js.map