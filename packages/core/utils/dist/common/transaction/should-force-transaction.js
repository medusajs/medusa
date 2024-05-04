"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldForceTransaction = void 0;
var types_1 = require("@medusajs/types");
function shouldForceTransaction(target) {
    var _a;
    return ((_a = target.moduleDeclaration) === null || _a === void 0 ? void 0 : _a.resources) === types_1.MODULE_RESOURCE_TYPE.ISOLATED;
}
exports.shouldForceTransaction = shouldForceTransaction;
//# sourceMappingURL=should-force-transaction.js.map