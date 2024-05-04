"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.LinkableKeys = {};
const entityLinkableKeysMap = {};
exports.entityNameToLinkableKeysMap = entityLinkableKeysMap;
exports.joinerConfig = {
    serviceName: modules_sdk_1.Modules.FILE,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["file", "files"],
            args: {
                entity: "File",
            },
        },
    ],
};
