"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectManager = void 0;
var context_parameter_1 = require("./context-parameter");
function InjectManager(managerProperty) {
    return function (target, propertyKey, descriptor) {
        if (!target.MedusaContextIndex_) {
            throw new Error("To apply @InjectManager you have to flag a parameter using @MedusaContext");
        }
        var originalMethod = descriptor.value;
        var argIndex = target.MedusaContextIndex_[propertyKey];
        descriptor.value = function () {
            var _a, _b;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var originalContext = (_a = args[argIndex]) !== null && _a !== void 0 ? _a : {};
            var copiedContext = {};
            var _loop_1 = function (key) {
                if (key === "manager" || key === "transactionManager") {
                    return "continue";
                }
                Object.defineProperty(copiedContext, key, {
                    get: function () {
                        return originalContext[key];
                    },
                    set: function (value) {
                        originalContext[key] = value;
                    },
                });
            };
            for (var key in originalContext) {
                _loop_1(key);
            }
            var resourceWithManager = !managerProperty
                ? this
                : this[managerProperty];
            copiedContext.manager =
                (_b = originalContext.manager) !== null && _b !== void 0 ? _b : resourceWithManager.getFreshManager();
            if (originalContext === null || originalContext === void 0 ? void 0 : originalContext.transactionManager) {
                copiedContext.transactionManager = originalContext === null || originalContext === void 0 ? void 0 : originalContext.transactionManager;
            }
            copiedContext.__type = context_parameter_1.MedusaContextType;
            args[argIndex] = copiedContext;
            return originalMethod.apply(this, args);
        };
    };
}
exports.InjectManager = InjectManager;
//# sourceMappingURL=inject-manager.js.map