"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const module_definition_1 = require("../module-definition");
const initialize = async (options, injectedDependencies) => {
    const loaded = await modules_sdk_1.MedusaModule.bootstrap({
        moduleKey: modules_sdk_1.Modules.PAYMENT,
        defaultPath: modules_sdk_1.MODULE_PACKAGE_NAMES[modules_sdk_1.Modules.PAYMENT],
        declaration: options,
        injectedDependencies,
        moduleExports: module_definition_1.moduleDefinition,
    });
    return loaded[modules_sdk_1.Modules.PAYMENT];
};
exports.initialize = initialize;
