"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeTableName = exports.composeLinkName = void 0;
const utils_1 = require("@medusajs/utils");
const composeLinkName = (...args) => {
    return (0, utils_1.lowerCaseFirst)((0, utils_1.toPascalCase)((0, exports.composeTableName)(...args.concat("link"))));
};
exports.composeLinkName = composeLinkName;
const composeTableName = (...args) => {
    return args.map((name) => name.replace(/(_id|Service)$/gi, "")).join("_");
};
exports.composeTableName = composeTableName;
