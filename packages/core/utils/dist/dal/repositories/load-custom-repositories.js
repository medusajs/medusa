"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCustomRepositories = void 0;
var awilix_1 = require("awilix");
var common_1 = require("../../common");
/**
 * Load the repositories from the custom repositories object. If a repository is not
 * present in the custom repositories object, the default repository will be used.
 *
 * @param customRepositories
 * @param container
 */
function loadCustomRepositories(_a) {
    var defaultRepositories = _a.defaultRepositories, customRepositories = _a.customRepositories, container = _a.container;
    var customRepositoriesMap = new Map(Object.entries(customRepositories));
    Object.entries(defaultRepositories).forEach(function (_a) {
        var _b;
        var _c = __read(_a, 2), key = _c[0], defaultRepository = _c[1];
        var finalRepository = customRepositoriesMap.get(key);
        if (!finalRepository ||
            !finalRepository.prototype.find) {
            finalRepository = defaultRepository;
        }
        container.register((_b = {},
            _b[(0, common_1.lowerCaseFirst)(key)] = (0, awilix_1.asClass)(finalRepository).singleton(),
            _b));
    });
}
exports.loadCustomRepositories = loadCustomRepositories;
//# sourceMappingURL=load-custom-repositories.js.map