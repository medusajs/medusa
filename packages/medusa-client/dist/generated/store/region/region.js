"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegions = exports.getRegionsRegion = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a Region.
 * @summary Retrieves a Region
 */
var getRegionsRegion = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/regions/".concat(id),
        method: "get",
    });
};
exports.getRegionsRegion = getRegionsRegion;
/**
 * Retrieves a list of Regions.
 * @summary List Regions
 */
var getRegions = function () {
    return (0, custom_instance_1.getClient)({ url: "/regions", method: "get" });
};
exports.getRegions = getRegions;
//# sourceMappingURL=region.js.map