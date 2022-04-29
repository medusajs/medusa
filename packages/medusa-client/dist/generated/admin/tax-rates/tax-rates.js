"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTaxRatesTaxRate = exports.getTaxRatesTaxRate = exports.deleteTaxRatesTaxRate = exports.postTaxRates = exports.deleteTaxRatesTaxRateShippingOptions = exports.postTaxRatesTaxRateShippingOptions = exports.deleteTaxRatesTaxRateProducts = exports.postTaxRatesTaxRateProducts = exports.deleteTaxRatesTaxRateProductTypes = exports.postTaxRatesTaxRateProductTypes = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Associates a Tax Rate with a list of Product Types
 * @summary Add Tax Rate to Product Types
 */
var postTaxRatesTaxRateProductTypes = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates/:id/product-types/batch",
        method: "post",
    });
};
exports.postTaxRatesTaxRateProductTypes = postTaxRatesTaxRateProductTypes;
/**
 * Removes a Tax Rate from a list of Product Types
 * @summary Remove Tax Rate from Product Types
 */
var deleteTaxRatesTaxRateProductTypes = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates/:id/product-types/batch",
        method: "delete",
    });
};
exports.deleteTaxRatesTaxRateProductTypes = deleteTaxRatesTaxRateProductTypes;
/**
 * Associates a Tax Rate with a list of Products
 * @summary Add Tax Rate to Products
 */
var postTaxRatesTaxRateProducts = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates/:id/products/batch",
        method: "post",
    });
};
exports.postTaxRatesTaxRateProducts = postTaxRatesTaxRateProducts;
/**
 * Removes a Tax Rate from a list of Products
 * @summary Removes Tax Rate from Products
 */
var deleteTaxRatesTaxRateProducts = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates/:id/products/batch",
        method: "delete",
    });
};
exports.deleteTaxRatesTaxRateProducts = deleteTaxRatesTaxRateProducts;
/**
 * Associates a Tax Rate with a list of Product Types
 * @summary Add Tax Rate to Product Types
 */
var postTaxRatesTaxRateShippingOptions = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates/:id/shipping-options/batch",
        method: "post",
    });
};
exports.postTaxRatesTaxRateShippingOptions = postTaxRatesTaxRateShippingOptions;
/**
 * Removes a Tax Rate from a list of Product Types
 * @summary Removes a Tax Rate from Product Types
 */
var deleteTaxRatesTaxRateShippingOptions = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates/:id/shipping-options/batch",
        method: "delete",
    });
};
exports.deleteTaxRatesTaxRateShippingOptions = deleteTaxRatesTaxRateShippingOptions;
/**
 * Creates a Tax Rate
 * @summary Create a Tax Rate
 */
var postTaxRates = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/tax-rates", method: "post" });
};
exports.postTaxRates = postTaxRates;
/**
 * Deletes a Tax Rate
 * @summary Delete a Tax Rate
 */
var deleteTaxRatesTaxRate = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates/".concat(id),
        method: "delete",
    });
};
exports.deleteTaxRatesTaxRate = deleteTaxRatesTaxRate;
/**
 * Retrieves a TaxRate
 * @summary Get Tax Rate
 */
var getTaxRatesTaxRate = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates/:id",
        method: "get",
    });
};
exports.getTaxRatesTaxRate = getTaxRatesTaxRate;
/**
 * Updates a Tax Rate
 * @summary Update a Tax Rate
 */
var postTaxRatesTaxRate = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/tax-rates/:id",
        method: "post",
    });
};
exports.postTaxRatesTaxRate = postTaxRatesTaxRate;
//# sourceMappingURL=tax-rates.js.map