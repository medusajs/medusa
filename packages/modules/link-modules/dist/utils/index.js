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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doNotForceTransaction = exports.shouldForceTransaction = void 0;
const types_1 = require("@medusajs/types");
__exportStar(require("./compose-link-name"), exports);
__exportStar(require("./generate-entity"), exports);
__exportStar(require("./generate-schema"), exports);
function shouldForceTransaction(target) {
    return target.moduleDeclaration?.resources === types_1.MODULE_RESOURCE_TYPE.ISOLATED;
}
exports.shouldForceTransaction = shouldForceTransaction;
function doNotForceTransaction() {
    return false;
}
exports.doNotForceTransaction = doNotForceTransaction;
