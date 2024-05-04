"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _models_1 = require("./models");
const schema_1 = __importDefault(require("./schema"));
exports.LinkableKeys = {
    workflow_execution_id: _models_1.WorkflowExecution.name,
};
const entityLinkableKeysMap = {};
Object.entries(exports.LinkableKeys).forEach(([key, value]) => {
    entityLinkableKeysMap[value] ?? (entityLinkableKeysMap[value] = []);
    entityLinkableKeysMap[value].push({
        mapTo: key,
        valueFrom: key.split("_").pop(),
    });
});
exports.entityNameToLinkableKeysMap = entityLinkableKeysMap;
exports.joinerConfig = {
    serviceName: modules_sdk_1.Modules.WORKFLOW_ENGINE,
    primaryKeys: ["id"],
    schema: schema_1.default,
    linkableKeys: exports.LinkableKeys,
    alias: {
        name: ["workflow_execution", "workflow_executions"],
        args: {
            entity: _models_1.WorkflowExecution.name,
            methodSuffix: "WorkflowExecution",
        },
    },
};
