"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var stripe_1 = __importDefault(require("stripe"));
var types_1 = require("@medusajs/types");
var utils_1 = require("@medusajs/utils");
var medusa_core_utils_1 = require("medusa-core-utils");
var types_2 = require("../types");
var StripeBase = /** @class */ (function (_super) {
    __extends(StripeBase, _super);
    function StripeBase(container, options) {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this.container_ = container;
        _this.options_ = options;
        _this.stripe_ = _this.init();
        return _this;
    }
    StripeBase.prototype.init = function () {
        this.validateOptions(this.config);
        return new stripe_1.default(this.config.apiKey);
    };
    StripeBase.prototype.validateOptions = function (options) {
        if (!(0, medusa_core_utils_1.isDefined)(options.apiKey)) {
            throw new Error("Required option `apiKey` is missing in Stripe plugin");
        }
    };
    Object.defineProperty(StripeBase.prototype, "options", {
        get: function () {
            return this.options_;
        },
        enumerable: false,
        configurable: true
    });
    StripeBase.prototype.getPaymentIntentOptions = function () {
        var _a, _b, _c;
        var options = {};
        if ((_a = this === null || this === void 0 ? void 0 : this.paymentIntentOptions) === null || _a === void 0 ? void 0 : _a.capture_method) {
            options.capture_method = this.paymentIntentOptions.capture_method;
        }
        if ((_b = this === null || this === void 0 ? void 0 : this.paymentIntentOptions) === null || _b === void 0 ? void 0 : _b.setup_future_usage) {
            options.setup_future_usage = this.paymentIntentOptions.setup_future_usage;
        }
        if ((_c = this === null || this === void 0 ? void 0 : this.paymentIntentOptions) === null || _c === void 0 ? void 0 : _c.payment_method_types) {
            options.payment_method_types =
                this.paymentIntentOptions.payment_method_types;
        }
        return options;
    };
    StripeBase.prototype.getPaymentStatus = function (paymentSessionData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, paymentIntent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = paymentSessionData.id;
                        return [4 /*yield*/, this.stripe_.paymentIntents.retrieve(id)];
                    case 1:
                        paymentIntent = _a.sent();
                        switch (paymentIntent.status) {
                            case "requires_payment_method":
                            case "requires_confirmation":
                            case "processing":
                                return [2 /*return*/, types_1.PaymentSessionStatus.PENDING];
                            case "requires_action":
                                return [2 /*return*/, types_1.PaymentSessionStatus.REQUIRES_MORE];
                            case "canceled":
                                return [2 /*return*/, types_1.PaymentSessionStatus.CANCELED];
                            case "requires_capture":
                            case "succeeded":
                                return [2 /*return*/, types_1.PaymentSessionStatus.AUTHORIZED];
                            default:
                                return [2 /*return*/, types_1.PaymentSessionStatus.PENDING];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    StripeBase.prototype.initiatePayment = function (input) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var intentRequestData, _e, email, extra, resource_id, customer, currency_code, amount, description, intentRequest, stripeCustomer, e_1, sessionData, e_2;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        intentRequestData = this.getPaymentIntentOptions();
                        _e = input.context, email = _e.email, extra = _e.extra, resource_id = _e.resource_id, customer = _e.customer;
                        currency_code = input.currency_code, amount = input.amount;
                        description = ((_a = extra === null || extra === void 0 ? void 0 : extra.payment_description) !== null && _a !== void 0 ? _a : (_b = this.options_) === null || _b === void 0 ? void 0 : _b.payment_description);
                        intentRequest = __assign({ description: description, amount: Math.round(new utils_1.BigNumber(amount).numeric), currency: currency_code, metadata: { resource_id: resource_id !== null && resource_id !== void 0 ? resource_id : "Medusa Payment" }, capture_method: this.options_.capture ? "automatic" : "manual" }, intentRequestData);
                        if ((_c = this.options_) === null || _c === void 0 ? void 0 : _c.automatic_payment_methods) {
                            intentRequest.automatic_payment_methods = { enabled: true };
                        }
                        if (!((_d = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _d === void 0 ? void 0 : _d.stripe_id)) return [3 /*break*/, 1];
                        intentRequest.customer = customer.metadata.stripe_id;
                        return [3 /*break*/, 6];
                    case 1:
                        stripeCustomer = void 0;
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.stripe_.customers.create({
                                email: email,
                            })];
                    case 3:
                        stripeCustomer = _f.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _f.sent();
                        return [2 /*return*/, this.buildError("An error occurred in initiatePayment when creating a Stripe customer", e_1)];
                    case 5:
                        intentRequest.customer = stripeCustomer.id;
                        _f.label = 6;
                    case 6:
                        _f.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.stripe_.paymentIntents.create(intentRequest)];
                    case 7:
                        sessionData = (_f.sent());
                        return [3 /*break*/, 9];
                    case 8:
                        e_2 = _f.sent();
                        return [2 /*return*/, this.buildError("An error occurred in InitiatePayment during the creation of the stripe payment intent", e_2)];
                    case 9: return [2 /*return*/, {
                            data: sessionData,
                            // TODO: REVISIT
                            // update_requests: customer?.metadata?.stripe_id
                            //   ? undefined
                            //   : {
                            //       customer_metadata: {
                            //         stripe_id: intentRequest.customer,
                            //       },
                            //     },
                        }];
                }
            });
        });
    };
    StripeBase.prototype.authorizePayment = function (paymentSessionData, context) {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPaymentStatus(paymentSessionData)];
                    case 1:
                        status = _a.sent();
                        return [2 /*return*/, { data: paymentSessionData, status: status }];
                }
            });
        });
    };
    StripeBase.prototype.cancelPayment = function (paymentSessionData) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = paymentSessionData.id;
                        return [4 /*yield*/, this.stripe_.paymentIntents.cancel(id)];
                    case 1: return [2 /*return*/, (_b.sent())];
                    case 2:
                        error_1 = _b.sent();
                        if (((_a = error_1.payment_intent) === null || _a === void 0 ? void 0 : _a.status) === types_2.ErrorIntentStatus.CANCELED) {
                            return [2 /*return*/, error_1.payment_intent];
                        }
                        return [2 /*return*/, this.buildError("An error occurred in cancelPayment", error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StripeBase.prototype.capturePayment = function (paymentSessionData) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, intent, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = paymentSessionData.id;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.stripe_.paymentIntents.capture(id)];
                    case 2:
                        intent = _b.sent();
                        return [2 /*return*/, intent];
                    case 3:
                        error_2 = _b.sent();
                        if (error_2.code === types_2.ErrorCodes.PAYMENT_INTENT_UNEXPECTED_STATE) {
                            if (((_a = error_2.payment_intent) === null || _a === void 0 ? void 0 : _a.status) === types_2.ErrorIntentStatus.SUCCEEDED) {
                                return [2 /*return*/, error_2.payment_intent];
                            }
                        }
                        return [2 /*return*/, this.buildError("An error occurred in capturePayment", error_2)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StripeBase.prototype.deletePayment = function (paymentSessionData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cancelPayment(paymentSessionData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StripeBase.prototype.refundPayment = function (paymentSessionData, refundAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var id, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = paymentSessionData.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.stripe_.refunds.create({
                                amount: Math.round(refundAmount),
                                payment_intent: id,
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        return [2 /*return*/, this.buildError("An error occurred in refundPayment", e_3)];
                    case 4: return [2 /*return*/, paymentSessionData];
                }
            });
        });
    };
    StripeBase.prototype.retrievePayment = function (paymentSessionData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, intent, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = paymentSessionData.id;
                        return [4 /*yield*/, this.stripe_.paymentIntents.retrieve(id)];
                    case 1:
                        intent = _a.sent();
                        return [2 /*return*/, intent];
                    case 2:
                        e_4 = _a.sent();
                        return [2 /*return*/, this.buildError("An error occurred in retrievePayment", e_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StripeBase.prototype.updatePayment = function (input) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var context, data, amount, amountNumeric, stripeId, result, id, sessionData, e_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        context = input.context, data = input.data, amount = input.amount;
                        amountNumeric = Math.round(new utils_1.BigNumber(amount).numeric);
                        stripeId = (_b = (_a = context.customer) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.stripe_id;
                        if (!(stripeId !== data.customer)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initiatePayment(input)];
                    case 1:
                        result = _c.sent();
                        if ((0, utils_1.isPaymentProviderError)(result)) {
                            return [2 /*return*/, this.buildError("An error occurred in updatePayment during the initiate of the new payment for the new customer", result)];
                        }
                        return [2 /*return*/, result];
                    case 2:
                        if (amount && data.amount === amountNumeric) {
                            return [2 /*return*/, { data: data }];
                        }
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        id = data.id;
                        return [4 /*yield*/, this.stripe_.paymentIntents.update(id, {
                                amount: amountNumeric,
                            })];
                    case 4:
                        sessionData = (_c.sent());
                        return [2 /*return*/, { data: sessionData }];
                    case 5:
                        e_5 = _c.sent();
                        return [2 /*return*/, this.buildError("An error occurred in updatePayment", e_5)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StripeBase.prototype.updatePaymentData = function (sessionId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Prevent from updating the amount from here as it should go through
                        // the updatePayment method to perform the correct logic
                        if (data.amount) {
                            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Cannot update amount, use updatePayment instead");
                        }
                        return [4 /*yield*/, this.stripe_.paymentIntents.update(sessionId, __assign({}, data))];
                    case 1: return [2 /*return*/, (_a.sent())];
                    case 2:
                        e_6 = _a.sent();
                        return [2 /*return*/, this.buildError("An error occurred in updatePaymentData", e_6)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StripeBase.prototype.getWebhookActionAndData = function (webhookData) {
        return __awaiter(this, void 0, void 0, function () {
            var event, intent;
            return __generator(this, function (_a) {
                event = this.constructWebhookEvent(webhookData);
                intent = event.data.object;
                switch (event.type) {
                    case "payment_intent.amount_capturable_updated":
                        return [2 /*return*/, {
                                action: utils_1.PaymentActions.AUTHORIZED,
                                data: {
                                    resource_id: intent.metadata.resource_id,
                                    amount: intent.amount_capturable, // NOTE: revisit when implementing multicapture
                                },
                            }];
                    case "payment_intent.succeeded":
                        return [2 /*return*/, {
                                action: utils_1.PaymentActions.SUCCESSFUL,
                                data: {
                                    resource_id: intent.metadata.resource_id,
                                    amount: intent.amount_received,
                                },
                            }];
                    case "payment_intent.payment_failed":
                        return [2 /*return*/, {
                                action: utils_1.PaymentActions.FAILED,
                                data: {
                                    resource_id: intent.metadata.resource_id,
                                    amount: intent.amount,
                                },
                            }];
                    default:
                        return [2 /*return*/, { action: utils_1.PaymentActions.NOT_SUPPORTED }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Constructs Stripe Webhook event
     * @param {object} data - the data of the webhook request: req.body
     *    ensures integrity of the webhook event
     * @return {object} Stripe Webhook event
     */
    StripeBase.prototype.constructWebhookEvent = function (data) {
        var signature = data.headers["stripe-signature"];
        return this.stripe_.webhooks.constructEvent(data.rawData, signature, this.config.webhookSecret);
    };
    StripeBase.prototype.buildError = function (message, error) {
        var _a, _b;
        return {
            error: message,
            code: "code" in error ? error.code : "unknown",
            detail: (0, utils_1.isPaymentProviderError)(error)
                ? "".concat(error.error).concat(os_1.EOL).concat((_a = error.detail) !== null && _a !== void 0 ? _a : "")
                : "detail" in error
                    ? error.detail
                    : (_b = error.message) !== null && _b !== void 0 ? _b : "",
        };
    };
    return StripeBase;
}(utils_1.AbstractPaymentProvider));
exports.default = StripeBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29yZS9zdHJpcGUtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlCQUF3QjtBQUV4QixrREFBMkI7QUFFM0IseUNBUXdCO0FBQ3hCLHlDQU13QjtBQUN4Qix1REFBNkM7QUFHN0Msa0NBTWlCO0FBRWpCO0lBQWtDLDhCQUEwQztJQUsxRSxvQkFBc0IsU0FBMEIsRUFBRSxPQUFzQjtRQUF4RSx3REFFVyxTQUFTLG1CQU1uQjtRQUpDLEtBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBO1FBQzNCLEtBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFBO1FBRXZCLEtBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFBOztJQUM1QixDQUFDO0lBRVMseUJBQUksR0FBZDtRQUNFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRWpDLE9BQU8sSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDdkMsQ0FBQztJQUlPLG9DQUFlLEdBQXZCLFVBQXdCLE9BQTBCO1FBQ2hELElBQUksQ0FBQyxJQUFBLDZCQUFTLEVBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQTtTQUN4RTtJQUNILENBQUM7SUFFRCxzQkFBSSwrQkFBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQ3RCLENBQUM7OztPQUFBO0lBRUQsNENBQXVCLEdBQXZCOztRQUNFLElBQU0sT0FBTyxHQUF5QixFQUFFLENBQUE7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