"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectSharedContext = void 0;
var context_parameter_1 = require("./context-parameter");
function InjectSharedContext() {
    return function (target, propertyKey, descriptor) {
        if (!target.MedusaContextIndex_) {
            throw new Error("To apply @InjectSharedContext you have to flag a parameter using @MedusaContext");
        }
        var originalMethod = descriptor.value;
        var argIndex = target.MedusaContextIndex_[propertyKey];
        descriptor.value = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var context = __assign({}, ((_a = args[argIndex]) !== null && _a !== void 0 ? _a : { __type: context_parameter_1.MedusaContextType }));
            args[argIndex] = context;
            return originalMethod.apply(this, args);
        };
    };
}
exports.InjectSharedContext = InjectSharedContext;
//# sourceMappingURL=inject-shared-context.js.map