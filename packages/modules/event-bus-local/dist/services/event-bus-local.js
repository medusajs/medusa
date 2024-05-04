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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const events_1 = require("events");
const ulid_1 = require("ulid");
const eventEmitter = new events_1.EventEmitter();
eventEmitter.setMaxListeners(Infinity);
// eslint-disable-next-line max-len
class LocalEventBusService extends utils_1.AbstractEventBusModuleService {
    constructor({ logger }) {
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        super(...arguments);
        this.logger_ = logger;
        this.eventEmitter_ = eventEmitter;
    }
    emit(eventOrData, data, options = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const isBulkEmit = Array.isArray(eventOrData);
            const events = isBulkEmit
                ? eventOrData
                : [{ eventName: eventOrData, data }];
            for (const event of events) {
                const eventListenersCount = this.eventEmitter_.listenerCount(event.eventName);
                (_a = this.logger_) === null || _a === void 0 ? void 0 : _a.info(`Processing ${event.eventName} which has ${eventListenersCount} subscribers`);
                if (eventListenersCount === 0) {
                    continue;
                }
                const data = (_b = event.data) !== null && _b !== void 0 ? _b : event.body;
                this.eventEmitter_.emit(event.eventName, data);
            }
        });
    }
    subscribe(event, subscriber) {
        const randId = (0, ulid_1.ulid)();
        this.storeSubscribers({ event, subscriberId: randId, subscriber });
        this.eventEmitter_.on(event, (...args) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // @ts-ignore
                yield subscriber(...args);
            }
            catch (e) {
                (_a = this.logger_) === null || _a === void 0 ? void 0 : _a.error(`An error occurred while processing ${event.toString()}: ${e}`);
            }
        }));
        return this;
    }
    unsubscribe(event, subscriber, context) {
        var _a;
        const existingSubscribers = this.eventToSubscribersMap_.get(event);
        if (existingSubscribers === null || existingSubscribers === void 0 ? void 0 : existingSubscribers.length) {
            const subIndex = existingSubscribers === null || existingSubscribers === void 0 ? void 0 : existingSubscribers.findIndex((sub) => sub.id === (context === null || context === void 0 ? void 0 : context.subscriberId));
            if (subIndex !== -1) {
                (_a = this.eventToSubscribersMap_.get(event)) === null || _a === void 0 ? void 0 : _a.splice(subIndex, 1);
            }
        }
        this.eventEmitter_.off(event, subscriber);
        return this;
    }
}
exports.default = LocalEventBusService;
//# sourceMappingURL=event-bus-local.js.map