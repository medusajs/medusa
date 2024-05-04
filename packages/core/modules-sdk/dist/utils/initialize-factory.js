"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFactory = void 0;
const definitions_1 = require("../definitions");
const medusa_module_1 = require("../medusa-module");
/**
 * Generate a initialize module factory that is exported by the module to be initialized manually
 *
 * @param moduleName
 * @param moduleDefinition
 */
function initializeFactory({ moduleName, moduleDefinition, }) {
    return async (options, injectedDependencies) => {
        const loaded = await medusa_module_1.MedusaModule.bootstrap({
            moduleKey: moduleName,
            defaultPath: definitions_1.MODULE_PACKAGE_NAMES[moduleName],
            declaration: options,
            injectedDependencies,
            moduleExports: moduleDefinition,
        });
        return loaded[moduleName];
    };
}
exports.initializeFactory = initializeFactory;
//# sourceMappingURL=initialize-factory.js.map