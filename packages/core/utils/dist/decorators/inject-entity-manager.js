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
exports.InjectEntityManager = void 0;
var decorators_1 = require("../modules-sdk/decorators");
// @deprecated Use InjectManager instead
function InjectEntityManager(shouldForceTransaction, managerProperty) {
    if (shouldForceTransaction === void 0) { shouldForceTransaction = function () { return false; }; }
    if (managerProperty === void 0) { managerProperty = "manager_"; }
    return function (target, propertyKey, descriptor) {
        if (!target.MedusaContextIndex_) {
            throw new Error("To apply @InjectEntityManager you have to flag a parameter using @MedusaContext");
        }
        var originalMethod = descriptor.value;
        var argIndex = target.MedusaContextIndex_[propertyKey];
        descriptor.value = function () {
            var _a, _b;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var shouldForceTransactionRes, context;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            shouldForceTransactionRes = shouldForceTransaction(target);
                            context = (_a = args[argIndex]) !== null && _a !== void 0 ? _a : {};
                            if (!(!shouldForceTransactionRes && (context === null || context === void 0 ? void 0 : context.transactionManager))) return [3 /*break*/, 2];
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 1: return [2 /*return*/, _c.sent()];
                        case 2: return [4 /*yield*/, (managerProperty === false
                                ? this
                                : this[managerProperty]).transaction(function (transactionManager) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            args[argIndex] = (_a = args[argIndex]) !== null && _a !== void 0 ? _a : { __type: decorators_1.MedusaContextType };
                                            args[argIndex].transactionManager = transactionManager;
                                            return [4 /*yield*/, originalMethod.apply(this, args)];
                                        case 1: return [2 /*return*/, _b.sent()];
                                    }
                                });
                            }); }, {
                                transaction: context === null || context === void 0 ? void 0 : context.transactionManager,
                                isolationLevel: context === null || context === void 0 ? void 0 : context.isolationLevel,
                                enableNestedTransactions: (_b = context.enableNestedTransactions) !== null && _b !== void 0 ? _b : false,
                            })];
                        case 3: return [2 /*return*/, _c.sent()];
                    }
                });
            });
        };
    };
}
exports.InjectEntityManager = InjectEntityManager;
//# sourceMappingURL=inject-entity-manager.js.map