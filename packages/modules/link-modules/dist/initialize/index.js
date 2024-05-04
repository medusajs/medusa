"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = exports.initialize = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const types_1 = require("@medusajs/types");
const utils_1 = require("@medusajs/utils");
const linkDefinitions = __importStar(require("../definitions"));
const migration_1 = require("../migration");
const utils_2 = require("../utils");
const module_definition_1 = require("./module-definition");
const initialize = async (options, modulesDefinition, injectedDependencies) => {
    const allLinks = {};
    const modulesLoadedKeys = modules_sdk_1.MedusaModule.getLoadedModules().map((mod) => Object.keys(mod)[0]);
    const allLinksToLoad = Object.values(linkDefinitions).concat(modulesDefinition ?? []);
    for (const linkDefinition of allLinksToLoad) {
        const definition = JSON.parse(JSON.stringify(linkDefinition));
        const [primary, foreign] = definition.relationships ?? [];
        if (definition.relationships?.length !== 2 && !definition.isReadOnlyLink) {
            throw new Error(`Link module ${definition.serviceName} can only link 2 modules.`);
        }
        else if (foreign?.foreignKey?.split(",").length > 1 &&
            !definition.isReadOnlyLink) {
            throw new Error(`Foreign key cannot be a composed key.`);
        }
        const serviceKey = !definition.isReadOnlyLink
            ? (0, utils_1.lowerCaseFirst)(definition.serviceName ??
                (0, utils_2.composeLinkName)(primary.serviceName, primary.foreignKey, foreign.serviceName, foreign.foreignKey))
            : (0, utils_1.simpleHash)(JSON.stringify(definition.extends));
        if (modulesLoadedKeys.includes(serviceKey)) {
            continue;
        }
        else if (serviceKey in allLinks) {
            throw new Error(`Link module ${serviceKey} already defined.`);
        }
        if (definition.isReadOnlyLink) {
            const extended = [];
            for (const extension of definition.extends ?? []) {
                if (modulesLoadedKeys.includes(extension.serviceName) &&
                    modulesLoadedKeys.includes(extension.relationship.serviceName)) {
                    extended.push(extension);
                }
            }
            definition.extends = extended;
            if (extended.length === 0) {
                continue;
            }
        }
        else if ((!primary.isInternalService &&
            !modulesLoadedKeys.includes(primary.serviceName)) ||
            (!foreign.isInternalService &&
                !modulesLoadedKeys.includes(foreign.serviceName))) {
            continue;
        }
        const logger = injectedDependencies?.[utils_1.ContainerRegistrationKeys.LOGGER] ?? console;
        definition.schema = (0, utils_2.generateGraphQLSchema)(definition, primary, foreign, {
            logger,
        });
        definition.alias ?? (definition.alias = []);
        for (const alias of definition.alias) {
            alias.args ?? (alias.args = {});
            alias.args.entity = (0, utils_1.toPascalCase)("Link_" +
                (definition.databaseConfig?.tableName ??
                    (0, utils_2.composeTableName)(primary.serviceName, primary.foreignKey, foreign.serviceName, foreign.foreignKey)));
        }
        const moduleDefinition = (0, module_definition_1.getLinkModuleDefinition)(definition, primary, foreign);
        const linkModuleDefinition = {
            key: serviceKey,
            registrationName: serviceKey,
            label: serviceKey,
            dependencies: [modules_sdk_1.ModuleRegistrationName.EVENT_BUS],
            defaultModuleDeclaration: {
                scope: types_1.MODULE_SCOPE.INTERNAL,
                resources: injectedDependencies?.[utils_1.ContainerRegistrationKeys.PG_CONNECTION]
                    ? types_1.MODULE_RESOURCE_TYPE.SHARED
                    : types_1.MODULE_RESOURCE_TYPE.ISOLATED,
            },
        };
        const loaded = await modules_sdk_1.MedusaModule.bootstrapLink({
            definition: linkModuleDefinition,
            declaration: options,
            moduleExports: moduleDefinition,
            injectedDependencies,
        });
        allLinks[serviceKey] = Object.values(loaded)[0];
    }
    return allLinks;
};
exports.initialize = initialize;
async function runMigrations({ options, logger, }, modulesDefinition) {
    const modulesLoadedKeys = modules_sdk_1.MedusaModule.getLoadedModules().map((mod) => Object.keys(mod)[0]);
    const allLinksToLoad = Object.values(linkDefinitions).concat(modulesDefinition ?? []);
    const allLinks = new Set();
    for (const definition of allLinksToLoad) {
        if (definition.isReadOnlyLink) {
            continue;
        }
        if (definition.relationships?.length !== 2) {
            throw new Error(`Link module ${definition.serviceName} must have 2 relationships.`);
        }
        const [primary, foreign] = definition.relationships ?? [];
        const serviceKey = (0, utils_1.lowerCaseFirst)(definition.serviceName ??
            (0, utils_2.composeLinkName)(primary.serviceName, primary.foreignKey, foreign.serviceName, foreign.foreignKey));
        if (allLinks.has(serviceKey)) {
            throw new Error(`Link module ${serviceKey} already exists.`);
        }
        allLinks.add(serviceKey);
        if (!modulesLoadedKeys.includes(primary.serviceName) ||
            !modulesLoadedKeys.includes(foreign.serviceName)) {
            continue;
        }
        const migrate = (0, migration_1.getMigration)(definition, serviceKey, primary, foreign);
        await migrate({ options, logger });
    }
}
exports.runMigrations = runMigrations;
