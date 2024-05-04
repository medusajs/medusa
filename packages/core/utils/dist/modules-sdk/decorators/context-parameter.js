"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedusaContextType = exports.MedusaContext = void 0;
function MedusaContext() {
    return function (target, propertyKey, parameterIndex) {
        var _a;
        (_a = target.MedusaContextIndex_) !== null && _a !== void 0 ? _a : (target.MedusaContextIndex_ = {});
        target.MedusaContextIndex_[propertyKey] = parameterIndex;
    };
}
exports.MedusaContext = MedusaContext;
MedusaContext.getIndex = function (target, propertyKey) {
    var _a;
    return (_a = target.MedusaContextIndex_) === null || _a === void 0 ? void 0 : _a[propertyKey];
};
exports.MedusaContextType = "MedusaContext";
//# sourceMappingURL=context-parameter.js.map