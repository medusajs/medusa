"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEntityId = void 0;
var ulid_1 = require("ulid");
/**
 * Generate a composed id based on the input parameters and return either the is if it exists or the generated one.
 * @param idProperty
 * @param prefix
 */
function generateEntityId(idProperty, prefix) {
    if (idProperty) {
        return idProperty;
    }
    var id = (0, ulid_1.ulid)();
    prefix = prefix ? "".concat(prefix, "_") : "";
    return "".concat(prefix).concat(id);
}
exports.generateEntityId = generateEntityId;
//# sourceMappingURL=generate-entity-id.js.map