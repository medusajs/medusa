"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleLoader = void 0;
const types_1 = require("@medusajs/types");
const awilix_1 = require("awilix");
const os_1 = require("os");
const utils_1 = require("./utils");
const moduleLoader = async ({ container, moduleResolutions, logger, migrationOnly, loaderOnly, }) => {
    for (const resolution of Object.values(moduleResolutions ?? {})) {
        const registrationResult = await loadModule(container, resolution, logger, migrationOnly, loaderOnly);
        if (registrationResult?.error) {
            const { error } = registrationResult;
            if (resolution.definition.isRequired) {
                logger?.error(`Could not resolve required module: ${resolution.definition.label}. Error: ${error.message}${os_1.EOL}`);
                throw error;
            }
            logger?.warn(`Could not resolve module: ${resolution.definition.label}. Error: ${error.message}${os_1.EOL}`);
        }
    }
};
exports.moduleLoader = moduleLoader;
async function loadModule(container, resolution, logger, migrationOnly, loaderOnly) {
    const modDefinition = resolution.definition;
    const registrationName = modDefinition.registrationName;
    const { scope, resources } = resolution.moduleDeclaration ?? {};
    if (scope === types_1.MODULE_SCOPE.EXTERNAL) {
        return await (0, utils_1.loadExternalModule)(container, resolution, logger);
    }
    if (!scope || (scope === types_1.MODULE_SCOPE.INTERNAL && !resources)) {
        let message = `The module ${resolution.definition.label} has to define its scope (internal | external)`;
        if (scope === types_1.MODULE_SCOPE.INTERNAL && !resources) {
            message = `The module ${resolution.definition.label} is missing its resources config`;
        }
        container.register(registrationName, (0, awilix_1.asValue)(undefined));
        return {
            error: new Error(message),
        };
    }
    if (resolution.resolutionPath === false) {
        container.register(registrationName, (0, awilix_1.asValue)(undefined));
        return;
    }
    return await (0, utils_1.loadInternalModule)(container, resolution, logger, migrationOnly, loaderOnly);
}
//# sourceMappingURL=module-loader.js.map