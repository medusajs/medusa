"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapObjectTo = void 0;
/**
 * Create a new object with the keys remapped and the values picked from the original object based
 * on the map config
 *
 * @param object input object
 * @param mapTo configuration to map the output object
 * @param removeIfNotRemapped if true, the keys that are not remapped will be removed from the output object
 * @param pick if provided, only the keys in the array will be picked from the output object
 */
function mapObjectTo(object, mapTo, _a) {
    var _b = _a === void 0 ? {} : _a, removeIfNotRemapped = _b.removeIfNotRemapped, pick = _b.pick;
    removeIfNotRemapped !== null && removeIfNotRemapped !== void 0 ? removeIfNotRemapped : (removeIfNotRemapped = false);
    var newObject = {};
    var _loop_1 = function (key) {
        var remapConfig = mapTo[key];
        if (!remapConfig) {
            if (!removeIfNotRemapped) {
                newObject[key] = object[key];
            }
            return "continue";
        }
        remapConfig.forEach(function (config) {
            if ((pick === null || pick === void 0 ? void 0 : pick.length) && !pick.includes(config.mapTo)) {
                return;
            }
            newObject[config.mapTo] = object[key]
                .map(function (obj) { return obj[config.valueFrom]; })
                .filter(Boolean);
        });
    };
    for (var key in object) {
        _loop_1(key);
    }
    return newObject;
}
exports.mapObjectTo = mapObjectTo;
//# sourceMappingURL=map-object-to.js.map