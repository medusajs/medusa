"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGraphQLSchema = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const compose_link_name_1 = require("./compose-link-name");
function generateGraphQLSchema(joinerConfig, primary, foreign, { logger } = { logger: console }) {
    let fieldNames;
    let entityName;
    if (!joinerConfig.isReadOnlyLink) {
        fieldNames = primary.foreignKey.split(",").concat(foreign.foreignKey);
        entityName = (0, utils_1.toPascalCase)("Link_" +
            (joinerConfig.databaseConfig?.tableName ??
                (0, compose_link_name_1.composeTableName)(primary.serviceName, primary.foreignKey, foreign.serviceName, foreign.foreignKey)));
    }
    let typeDef = "";
    for (const extend of joinerConfig.extends ?? []) {
        const extendedModule = modules_sdk_1.MedusaModule.getModuleInstance(extend.serviceName);
        if (!extendedModule && !extend.relationship.isInternalService) {
            throw new Error(`Module ${extend.serviceName} not found. Please verify that the module is configured and installed, also the module must be loaded before the link modules.`);
        }
        const extJoinerConfig = modules_sdk_1.MedusaModule.getJoinerConfig(extend.relationship.serviceName);
        let extendedEntityName = extJoinerConfig?.linkableKeys?.[extend.relationship.foreignKey];
        if (!extendedEntityName && (!primary || !foreign)) {
            logger.warn(`Link modules schema: No linkable key found for ${extend.relationship.foreignKey} on module ${extend.relationship.serviceName}.`);
            continue;
        }
        const fieldName = (0, utils_1.camelToSnakeCase)((0, utils_1.lowerCaseFirst)(extend.relationship.alias));
        let type = extend.relationship.isList ? `[${entityName}]` : entityName;
        if (extJoinerConfig?.isReadOnlyLink) {
            type = extend.relationship.isList
                ? `[${extendedEntityName}]`
                : extendedEntityName;
        }
        typeDef += `    
      extend type ${extend.serviceName} {
        ${fieldName}: ${type}
      }
    `;
    }
    if (joinerConfig.isReadOnlyLink) {
        return typeDef;
    }
    // Pivot table fields
    const fields = fieldNames.reduce((acc, curr) => {
        acc[curr] = {
            type: "String",
            nullable: false,
        };
        return acc;
    }, {});
    const extraFields = joinerConfig.databaseConfig?.extraFields ?? {};
    for (const column in extraFields) {
        fields[column] = {
            type: getGraphQLType(extraFields[column].type),
            nullable: !!extraFields[column].nullable,
        };
    }
    // Link table relationships
    const primaryField = `${(0, utils_1.camelToSnakeCase)(primary.alias)}: ${(0, utils_1.toPascalCase)((0, compose_link_name_1.composeTableName)(primary.serviceName))}`;
    const foreignField = `${(0, utils_1.camelToSnakeCase)(foreign.alias)}: ${(0, utils_1.toPascalCase)((0, compose_link_name_1.composeTableName)(foreign.serviceName))}`;
    typeDef += `
    type ${entityName} {
      ${Object.entries(fields)
        .map(([field, { type, nullable }]) => `${field}: ${nullable ? type : `${type}!`}`)
        .join("\n      ")}
        
      ${primaryField}
      ${foreignField}
      
      createdAt: String!
      updatedAt: String!
      deletedAt: String
    }
  `;
    return typeDef;
}
exports.generateGraphQLSchema = generateGraphQLSchema;
function getGraphQLType(type) {
    const typeDef = {
        numeric: "Float",
        integer: "Int",
        smallint: "Int",
        tinyint: "Int",
        mediumint: "Int",
        float: "Float",
        double: "Float",
        boolean: "Boolean",
        decimal: "Float",
        string: "String",
        uuid: "ID",
        text: "String",
        date: "Date",
        time: "Time",
        datetime: "DateTime",
        bigint: "BigInt",
        blob: "Blob",
        uint8array: "[Int]",
        array: "[String]",
        enumArray: "[String]",
        enum: "String",
        json: "JSON",
        jsonb: "JSON",
    };
    return typeDef[type] ?? "String";
}
