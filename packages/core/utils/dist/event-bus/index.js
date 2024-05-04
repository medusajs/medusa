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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEventBusModuleService = void 0;
var ulid_1 = require("ulid");
var AbstractEventBusModuleService = /** @class */ (function () {
    function AbstractEventBusModuleService() {
        this.eventToSubscribersMap_ = new Map();
    }
    Object.defineProperty(AbstractEventBusModuleService.prototype, "eventToSubscribersMap", {
        get: function () {
            return this.eventToSubscribersMap_;
        },
        enumerable: false,
        configurable: true
    });
    AbstractEventBusModuleService.prototype.storeSubscribers = function (_a) {
        var _b;
        var event = _a.event, subscriberId = _a.subscriberId, subscriber = _a.subscriber;
        var newSubscriberDescriptor = { subscriber: subscriber, id: subscriberId };
        var existingSubscribers = (_b = this.eventToSubscribersMap_.get(event)) !== null && _b !== void 0 ? _b : [];
        var subscriberAlreadyExists = existingSubscribers.find(function (sub) { return sub.id === subscriberId; });
        if (subscriberAlreadyExists) {
            throw Error("Subscriber with id ".concat(subscriberId, " already exists"));
        }
        this.eventToSubscribersMap_.set(event, __spreadArray(__spreadArray([], __read(existingSubscribers), false), [
            newSubscriberDescriptor,
        ], false));
    };
    AbstractEventBusModuleService.prototype.subscribe = function (eventName, subscriber, context) {
        var _a;
        if (typeof subscriber !== "function") {
            throw new Error("Subscriber must be a function");
        }
        /**
         * If context is provided, we use the subscriberId from it
         * otherwise we generate a random using a ulid
         */
        var randId = (0, ulid_1.ulid)();
        var event = eventName.toString();
        this.storeSubscribers({
            event: event,
            subscriberId: (_a = context === null || context === void 0 ? void 0 : context.subscriberId) !== null && _a !== void 0 ? _a : "".concat(event, "-").concat(randId),
            subscriber: subscriber,
        });
        return this;
    };
    AbstractEventBusModuleService.prototype.unsubscribe = function (eventName, subscriber, context) {
        var _a;
        if (typeof subscriber !== "function") {
            throw new Error("Subscriber must be a function");
        }
        var existingSubscribers = this.eventToSubscribersMap_.get(eventName);
        if (existingSubscribers === null || existingSubscribers === void 0 ? void 0 : existingSubscribers.length) {
            var subIndex = existingSubscribers === null || existingSubscribers === void 0 ? void 0 : existingSubscribers.findIndex(function (sub) { return sub.id === (context === null || context === void 0 ? void 0 : context.subscriberId); });
            if (subIndex !== -1) {
                (_a = this.eventToSubscribersMap_
                    .get(eventName)) === null || _a === void 0 ? void 0 : _a.splice(subIndex, 1);
            }
        }
        return this;
    };
    return AbstractEventBusModuleService;
}());
exports.AbstractEventBusModuleService = AbstractEventBusModuleService;
__exportStar(require("./build-event-messages"), exports);
__exportStar(require("./common-events"), exports);
__exportStar(require("./message-aggregator"), exports);
__exportStar(require("./utils"), exports);
//# sourceMappingURL=index.js.map