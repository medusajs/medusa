"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEntity = void 0;
const utils_1 = require("@medusajs/utils");
const core_1 = require("@mikro-orm/core");
const compose_link_name_1 = require("./compose-link-name");
function getClass(...properties) {
    return class LinkModel {
        constructor(...values) {
            properties.forEach((name, idx) => {
                this[name] = values[idx];
            });
        }
    };
}
function generateEntity(joinerConfig, primary, foreign) {
    const fieldNames = primary.foreignKey.split(",").concat(foreign.foreignKey);
    const tableName = joinerConfig.databaseConfig?.tableName ??
        (0, compose_link_name_1.composeTableName)(primary.serviceName, primary.foreignKey, foreign.serviceName, foreign.foreignKey);
    const fields = fieldNames.reduce((acc, curr) => {
        acc[curr] = {
            type: "string",
            nullable: false,
            primary: true,
        };
        return acc;
    }, {});
    const extraFields = joinerConfig.databaseConfig?.extraFields ?? {};
    for (const column in extraFields) {
        fieldNames.push(column);
        fields[column] = {
            type: extraFields[column].type,
            nullable: !!extraFields[column].nullable,
            defaultRaw: extraFields[column].defaultValue,
            ...(extraFields[column].options ?? {}),
        };
    }
    const hashTableName = (0, utils_1.simpleHash)(tableName);
    return new core_1.EntitySchema({
        class: getClass(...fieldNames.concat("created_at", "updated_at", "deleted_at")),
        tableName,
        properties: {
            id: {
                type: "string",
                nullable: false,
            },
            ...fields,
            created_at: {
                type: "Date",
                nullable: false,
                defaultRaw: "CURRENT_TIMESTAMP",
            },
            updated_at: {
                type: "Date",
                nullable: false,
                defaultRaw: "CURRENT_TIMESTAMP",
            },
            deleted_at: { type: "Date", nullable: true },
        },
        filters: {
            [utils_1.SoftDeletableFilterKey]: utils_1.mikroOrmSoftDeletableFilterOptions,
        },
        hooks: {
            beforeUpdate: [
                (args) => {
                    args.entity.updated_at = new Date();
                },
            ],
        },
        indexes: [
            {
                properties: ["id"],
                name: "IDX_id_" + hashTableName,
            },
            {
                properties: primary.foreignKey.split(","),
                name: "IDX_" +
                    primary.foreignKey.split(",").join("_") +
                    "_" +
                    hashTableName,
            },
            {
                properties: foreign.foreignKey,
                name: "IDX_" + foreign.foreignKey + "_" + hashTableName,
            },
            {
                properties: ["deleted_at"],
                name: "IDX_deleted_at_" + hashTableName,
            },
        ],
    });
}
exports.generateEntity = generateEntity;
