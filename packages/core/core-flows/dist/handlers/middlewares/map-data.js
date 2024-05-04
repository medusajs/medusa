"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapData = void 0;
/**
 * Middleware for map input data to a key/s.
 *
 * @param mapFn - apply function on the input data and return result as the middleware output
 * @param alias - key to save output under (if `merge === false`)
 */
function mapData(mapFn, alias = "mapData") {
    return async function ({ data }) {
        return {
            alias,
            value: mapFn(data),
        };
    };
}
exports.mapData = mapData;
