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
exports.AbstractFulfillmentProviderService = void 0;
var AbstractFulfillmentProviderService = /** @class */ (function () {
    function AbstractFulfillmentProviderService() {
    }
    AbstractFulfillmentProviderService.isFulfillmentService = function (obj) {
        var _a;
        return (_a = obj === null || obj === void 0 ? void 0 : obj.constructor) === null || _a === void 0 ? void 0 : _a._isFulfillmentService;
    };
    AbstractFulfillmentProviderService.prototype.getIdentifier = function () {
        return this.constructor.identifier;
    };
    AbstractFulfillmentProviderService.prototype.getFulfillmentOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("getFulfillmentOptions must be overridden by the child class");
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.validateFulfillmentData = function (optionData, data, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("validateFulfillmentData must be overridden by the child class");
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.validateOption = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("validateOption must be overridden by the child class");
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.canCalculate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("canCalculate must be overridden by the child class");
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.calculatePrice = function (optionData, data, cart) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("calculatePrice must be overridden by the child class");
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.createFulfillment = function (data, items, order, fulfillment) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("createFulfillment must be overridden by the child class");
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.cancelFulfillment = function (fulfillment) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("cancelFulfillment must be overridden by the child class");
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.getFulfillmentDocuments = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.createReturnFulfillment = function (fromData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("createReturn must be overridden by the child class");
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.getReturnDocuments = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.getShipmentDocuments = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    AbstractFulfillmentProviderService.prototype.retrieveDocuments = function (fulfillmentData, documentType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw Error("retrieveDocuments must be overridden by the child class");
            });
        });
    };
    AbstractFulfillmentProviderService._isFulfillmentService = true;
    return AbstractFulfillmentProviderService;
}());
exports.AbstractFulfillmentProviderService = AbstractFulfillmentProviderService;
//# sourceMappingURL=provider.js.map