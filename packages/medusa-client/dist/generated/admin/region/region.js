"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRegionsRegionMetadata = exports.postRegionsRegionPaymentProvidersProvider = exports.postRegionsRegionFulfillmentProvidersProvider = exports.postRegionsRegionCountriesCountry = exports.getRegionsRegionFulfillmentOptions = exports.postRegionsRegion = exports.getRegionsRegion = exports.deleteRegionsRegion = exports.deleteRegionsRegionMetadataKey = exports.getRegions = exports.postRegions = exports.postRegionsRegionPaymentProviders = exports.postRegionsRegionFulfillmentProviders = exports.postRegionsRegionCountries = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Adds a Country to the list of Countries in a Region
 * @summary Add Country
 */
var postRegionsRegionCountries = function (id, postRegionsRegionCountriesBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id, "/countries"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postRegionsRegionCountriesBody,
    });
};
exports.postRegionsRegionCountries = postRegionsRegionCountries;
/**
 * Adds a Fulfillment Provider to a Region
 * @summary Add Fulfillment Provider
 */
var postRegionsRegionFulfillmentProviders = function (id, postRegionsRegionFulfillmentProvidersBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id, "/fulfillment-providers"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postRegionsRegionFulfillmentProvidersBody,
    });
};
exports.postRegionsRegionFulfillmentProviders = postRegionsRegionFulfillmentProviders;
/**
 * Adds a Payment Provider to a Region
 * @summary Add Payment Provider
 */
var postRegionsRegionPaymentProviders = function (id, postRegionsRegionPaymentProvidersBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id, "/payment-providers"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postRegionsRegionPaymentProvidersBody,
    });
};
exports.postRegionsRegionPaymentProviders = postRegionsRegionPaymentProviders;
/**
 * Creates a Region
 * @summary Create a Region
 */
var postRegions = function (postRegionsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postRegionsBody,
    });
};
exports.postRegions = postRegions;
/**
 * Retrieves a list of Regions.
 * @summary List Regions
 */
var getRegions = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions",
        method: "get",
        params: params,
    });
};
exports.getRegions = getRegions;
/**
 * Deletes a metadata key.
 * @summary Delete Metadata
 */
var deleteRegionsRegionMetadataKey = function (id, key) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id, "/metadata/").concat(key),
        method: "delete",
    });
};
exports.deleteRegionsRegionMetadataKey = deleteRegionsRegionMetadataKey;
/**
 * Deletes a Region.
 * @summary Delete a Region
 */
var deleteRegionsRegion = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id),
        method: "delete",
    });
};
exports.deleteRegionsRegion = deleteRegionsRegion;
/**
 * Retrieves a Region.
 * @summary Retrieve a Region
 */
var getRegionsRegion = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id),
        method: "get",
    });
};
exports.getRegionsRegion = getRegionsRegion;
/**
 * Updates a Region
 * @summary Update a Region
 */
var postRegionsRegion = function (id, postRegionsRegionBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postRegionsRegionBody,
    });
};
exports.postRegionsRegion = postRegionsRegion;
/**
 * Gathers all the fulfillment options available to in the Region.
 * @summary List Fulfillment Options available in the Region
 */
var getRegionsRegionFulfillmentOptions = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id, "/fulfillment-options"),
        method: "get",
    });
};
exports.getRegionsRegionFulfillmentOptions = getRegionsRegionFulfillmentOptions;
/**
 * Removes a Country from the list of Countries in a Region
 * @summary Remove Country
 */
var postRegionsRegionCountriesCountry = function (id, countryCode) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id, "/countries/").concat(countryCode),
        method: "delete",
    });
};
exports.postRegionsRegionCountriesCountry = postRegionsRegionCountriesCountry;
/**
 * Removes a Fulfillment Provider.
 * @summary Remove Fulfillment Provider
 */
var postRegionsRegionFulfillmentProvidersProvider = function (id, providerId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id, "/fulfillment-providers/").concat(providerId),
        method: "delete",
    });
};
exports.postRegionsRegionFulfillmentProvidersProvider = postRegionsRegionFulfillmentProvidersProvider;
/**
 * Removes a Payment Provider.
 * @summary Remove Payment Provider
 */
var postRegionsRegionPaymentProvidersProvider = function (id, providerId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id, "/payment-providers/").concat(providerId),
        method: "delete",
    });
};
exports.postRegionsRegionPaymentProvidersProvider = postRegionsRegionPaymentProvidersProvider;
/**
 * Sets the metadata of a Region
 * @summary Set the metadata of a Region
 */
var postRegionsRegionMetadata = function (id, postRegionsRegionMetadataBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/regions/".concat(id, "/metadata"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postRegionsRegionMetadataBody,
    });
};
exports.postRegionsRegionMetadata = postRegionsRegionMetadata;
//# sourceMappingURL=region.js.map