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
exports.MODULE_RESOURCE_TYPE = exports.MODULE_SCOPE = void 0;
__exportStar(require("../common/medusa-container"), exports);
var MODULE_SCOPE;
(function (MODULE_SCOPE) {
    MODULE_SCOPE["INTERNAL"] = "internal";
    MODULE_SCOPE["EXTERNAL"] = "external";
})(MODULE_SCOPE || (exports.MODULE_SCOPE = MODULE_SCOPE = {}));
var MODULE_RESOURCE_TYPE;
(function (MODULE_RESOURCE_TYPE) {
    MODULE_RESOURCE_TYPE["SHARED"] = "shared";
    MODULE_RESOURCE_TYPE["ISOLATED"] = "isolated";
})(MODULE_RESOURCE_TYPE || (exports.MODULE_RESOURCE_TYPE = MODULE_RESOURCE_TYPE = {}));
//# sourceMappingURL=common.js.map