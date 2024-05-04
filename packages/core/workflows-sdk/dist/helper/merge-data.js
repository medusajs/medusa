"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeData = void 0;
const utils_1 = require("@medusajs/utils");
/**
 * Pipe utils that merges data from an object into a new object.
 * The new object will have a target key with the merged data from the keys if specified.
 * @param keys
 * @param target
 */
function mergeData(keys = [], target) {
    return async function ({ data }) {
        const workingKeys = (keys.length ? keys : Object.keys(data));
        const value = workingKeys.reduce((acc, key) => {
            let targetAcc = { ...(target ? acc[target] : acc) };
            targetAcc ?? (targetAcc = {});
            if (Array.isArray(data[key])) {
                targetAcc[key] = data[key];
            }
            else if ((0, utils_1.isObject)(data[key])) {
                targetAcc = {
                    ...targetAcc,
                    ...data[key],
                };
            }
            else {
                targetAcc[key] = data[key];
            }
            if (target) {
                acc[target] = {
                    ...acc[target],
                    ...targetAcc,
                };
            }
            else {
                acc = targetAcc;
            }
            return acc;
        }, {});
        return {
            alias: target,
            value: target ? value[target] : value,
        };
    };
}
exports.mergeData = mergeData;
//# sourceMappingURL=merge-data.js.map