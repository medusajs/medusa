"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectTransactionManager = void 0;
var common_1 = require("../../common");
var context_parameter_1 = require("./context-parameter");
function InjectTransactionManager(shouldForceTransactionOrManagerProperty, managerProperty) {
    if (shouldForceTransactionOrManagerProperty === void 0) { shouldForceTransactionOrManagerProperty = function () { return false; }; }
    return function (target, propertyKey, descriptor) {
        if (!target.MedusaContextIndex_) {
            throw new Error("An error occured applying decorator '@InjectTransactionManager' to method ".concat(String(propertyKey), ": Missing parameter with flag @MedusaContext"));
        }
        var originalMethod = descriptor.value;
        var shouldForceTransaction = !(0, common_1.isString)(shouldForceTransactionOrManagerProperty)
            ? shouldForceTransactionOrManagerProperty
            : function () { return false; };
        managerProperty = (0, common_1.isString)(shouldForceTransactionOrManagerProperty)
            ? shouldForceTransactionOrManagerProperty
            : managerProperty;
        var argIndex = target.MedusaContextIndex_[propertyKey];
        descriptor.value = function () {
            var _a, _b, _c;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var shouldForceTransactionRes, context, originalContext;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            shouldForceTransactionRes = shouldForceTransaction(target);
                            context = (_a = args[argIndex]) !== null && _a !== void 0 ? _a : {};
                            originalContext = (_b = args[argIndex]) !== null && _b !== void 0 ? _b : {};
                            if (!(!shouldForceTransactionRes && (context === null || context === void 0 ? void 0 : context.transactionManager))) return [3 /*break*/, 2];
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 1: return [2 /*return*/, _d.sent()];
                        case 2: return [4 /*yield*/, (!managerProperty
                                ? this
                                : this[managerProperty]).transaction(function (transactionManager) { return __awaiter(_this, void 0, void 0, function () {
                                var copiedContext, _loop_1, key;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            copiedContext = {};
                                            _loop_1 = function (key) {
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
                                            for (key in originalContext) {
                                                _loop_1(key);
                                            }
                                            copiedContext.transactionManager = transactionManager;
                                            if (originalContext === null || originalContext === void 0 ? void 0 : originalContext.manager) {
                                                copiedContext.manager = originalContext === null || originalContext === void 0 ? void 0 : originalContext.manager;
                                            }
                                            copiedContext.__type = context_parameter_1.MedusaContextType;
                                            args[argIndex] = copiedContext;
                                            return [4 /*yield*/, originalMethod.apply(this, args)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }, {
                                transaction: context === null || context === void 0 ? void 0 : context.transactionManager,
                                isolationLevel: context === null || context === void 0 ? void 0 : context.isolationLevel,
                                enableNestedTransactions: (_c = context.enableNestedTransactions) !== null && _c !== void 0 ? _c : false,
                            })];
                        case 3: return [2 /*return*/, _d.sent()];
                    }
                });
            });
        };
    };
}
exports.InjectTransactionManager = InjectTransactionManager;
//# sourceMappingURL=inject-transaction-manager.js.map