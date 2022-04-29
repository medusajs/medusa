"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postShippingProfilesProfile = exports.getShippingProfilesProfile = exports.deleteShippingProfilesProfile = exports.getShippingProfiles = exports.postShippingProfiles = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a Shipping Profile
 * @summary Create a Shipping Profile
 */
var postShippingProfiles = function (postShippingProfilesBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-profiles",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postShippingProfilesBody,
    });
};
exports.postShippingProfiles = postShippingProfiles;
/**
 * Retrieves a list of Shipping Profile.
 * @summary List Shipping Profiles
 */
var getShippingProfiles = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-profiles",
        method: "get",
    });
};
exports.getShippingProfiles = getShippingProfiles;
/**
 * Deletes a Shipping Profile.
 * @summary Delete a Shipping Profile
 */
var deleteShippingProfilesProfile = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-profiles/".concat(id),
        method: "delete",
    });
};
exports.deleteShippingProfilesProfile = deleteShippingProfilesProfile;
/**
 * Retrieves a Shipping Profile.
 * @summary Retrieve a Shipping Profile
 */
var getShippingProfilesProfile = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-profiles/".concat(id),
        method: "get",
    });
};
exports.getShippingProfilesProfile = getShippingProfilesProfile;
/**
 * Updates a Shipping Profile
 * @summary Update a Shipping Profiles
 */
var postShippingProfilesProfile = function (id, postShippingProfilesProfileBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/shipping-profiles/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postShippingProfilesProfileBody,
    });
};
exports.postShippingProfilesProfile = postShippingProfilesProfile;
//# sourceMappingURL=shipping-profile.js.map