"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMedusaLinkModule = exports.registerMedusaModule = void 0;
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
const resolve_cwd_1 = __importDefault(require("resolve-cwd"));
const definitions_1 = require("../definitions");
const registerMedusaModule = (moduleKey, moduleDeclaration, moduleExports, definition) => {
    const moduleResolutions = {};
    const modDefinition = definition ?? definitions_1.ModulesDefinition[moduleKey];
    const modDeclaration = moduleDeclaration ??
        modDefinition?.defaultModuleDeclaration;
    if (modDeclaration !== false && !modDeclaration) {
        throw new Error(`Module: ${moduleKey} has no declaration.`);
    }
    if ((0, utils_1.isObject)(modDeclaration) &&
        modDeclaration?.scope === types_1.MODULE_SCOPE.EXTERNAL) {
        moduleResolutions[moduleKey] = getExternalModuleResolution(modDefinition, modDeclaration);
    }
    else {
        moduleResolutions[moduleKey] = getInternalModuleResolution(modDefinition, moduleDeclaration, moduleExports);
    }
    if (modDefinition === undefined) {
        moduleResolutions[moduleKey] = getCustomModuleResolution(moduleKey, moduleDeclaration);
        return moduleResolutions;
    }
    moduleResolutions[moduleKey] = getInternalModuleResolution(modDefinition, moduleDeclaration, moduleExports);
    return moduleResolutions;
};
exports.registerMedusaModule = registerMedusaModule;
function getCustomModuleResolution(key, moduleConfig) {
    const resolutionPath = (0, resolve_cwd_1.default)((0, utils_1.isString)(moduleConfig) ? moduleConfig : moduleConfig.resolve);
    const conf = (0, utils_1.isObject)(moduleConfig)
        ? moduleConfig
        : {};
    const dependencies = conf?.dependencies ?? [];
    return {
        resolutionPath,
        definition: {
            key,
            label: `Custom: ${key}`,
            isRequired: false,
            defaultPackage: "",
            dependencies,
            registrationName: key,
            defaultModuleDeclaration: {
                resources: types_1.MODULE_RESOURCE_TYPE.SHARED,
                scope: types_1.MODULE_SCOPE.INTERNAL,
            },
        },
        moduleDeclaration: {
            resources: conf?.resources ?? types_1.MODULE_RESOURCE_TYPE.SHARED,
            scope: types_1.MODULE_SCOPE.INTERNAL,
        },
        dependencies,
        options: conf?.options ?? {},
    };
}
const registerMedusaLinkModule = (definition, moduleDeclaration, moduleExports) => {
    const moduleResolutions = {};
    moduleResolutions[definition.key] = getInternalModuleResolution(definition, moduleDeclaration, moduleExports);
    return moduleResolutions;
};
exports.registerMedusaLinkModule = registerMedusaLinkModule;
function getInternalModuleResolution(definition, moduleConfig, moduleExports) {
    if (typeof moduleConfig === "boolean") {
        if (!moduleConfig && definition.isRequired) {
            throw new Error(`Module: ${definition.label} is required`);
        }
        if (!moduleConfig) {
            return {
                resolutionPath: false,
                definition,
                dependencies: [],
                options: {},
            };
        }
    }
    const isObj = (0, utils_1.isObject)(moduleConfig);
    let resolutionPath = definition.defaultPackage;
    // If user added a module and it's overridable, we resolve that instead
    const isStr = (0, utils_1.isString)(moduleConfig);
    if (isStr || (isObj && moduleConfig.resolve)) {
        resolutionPath = !moduleExports
            ? (0, resolve_cwd_1.default)(isStr ? moduleConfig : moduleConfig.resolve)
            : // Explicitly assign an empty string, later, we will check if the value is exactly false.
                // This allows to continue the module loading while using the module exports instead of re importing the module itself during the process.
                "";
    }
    const moduleDeclaration = isObj ? moduleConfig : {};
    const additionalDependencies = isObj ? moduleConfig.dependencies || [] : [];
    return {
        resolutionPath,
        definition,
        dependencies: [
            ...new Set((definition.dependencies || []).concat(additionalDependencies)),
        ],
        moduleDeclaration: {
            ...(definition.defaultModuleDeclaration ?? {}),
            ...moduleDeclaration,
        },
        moduleExports,
        options: isObj ? moduleConfig.options ?? {} : {},
    };
}
function getExternalModuleResolution(definition, moduleConfig) {
    if (!moduleConfig.server) {
        throw new Error(`Module: External module ${definition.label} is missing server configuration.`);
    }
    return {
        resolutionPath: false,
        definition,
        moduleDeclaration: moduleConfig,
    };
}
//# sourceMappingURL=register-modules.js.map