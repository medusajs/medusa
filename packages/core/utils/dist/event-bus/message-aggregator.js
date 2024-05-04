"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageAggregator = void 0;
var build_event_messages_1 = require("./build-event-messages");
var MessageAggregator = /** @class */ (function () {
    function MessageAggregator() {
        this.messages = [];
    }
    MessageAggregator.prototype.save = function (msg) {
        var _a;
        if (!msg || (Array.isArray(msg) && msg.length === 0)) {
            return;
        }
        if (Array.isArray(msg)) {
            (_a = this.messages).push.apply(_a, __spreadArray([], __read(msg), false));
        }
        else {
            this.messages.push(msg);
        }
    };
    MessageAggregator.prototype.saveRawMessageData = function (messageData, options) {
        this.save((0, build_event_messages_1.buildEventMessages)(messageData, options));
    };
    MessageAggregator.prototype.getMessages = function (format) {
        var _this = this;
        var _a = format !== null && format !== void 0 ? format : {}, groupBy = _a.groupBy, sortBy = _a.sortBy;
        if (sortBy) {
            this.messages.sort(function (a, b) { return _this.compareMessages(a, b, sortBy); });
        }
        var messages = { default: this.messages };
        if (groupBy) {
            var groupedMessages = this.messages.reduce(function (acc, msg) {
                var key = groupBy
                    .map(function (field) { return _this.getValueFromPath(msg, field); })
                    .join("-");
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(msg);
                return acc;
            }, {});
            messages = groupedMessages;
        }
        return messages;
    };
    MessageAggregator.prototype.clearMessages = function () {
        this.messages = [];
    };
    MessageAggregator.prototype.getValueFromPath = function (obj, path) {
        var e_1, _a;
        var keys = path.split(".");
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                obj = obj[key];
                if (obj === undefined)
                    break;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return obj;
    };
    MessageAggregator.prototype.compareMessages = function (a, b, sortBy) {
        var e_2, _a;
        try {
            for (var _b = __values(Object.keys(sortBy)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                var orderCriteria = sortBy[key];
                var valueA = this.getValueFromPath(a, key);
                var valueB = this.getValueFromPath(b, key);
                // User defined order
                if (Array.isArray(orderCriteria)) {
                    var indexA = orderCriteria.indexOf(valueA);
                    var indexB = orderCriteria.indexOf(valueB);
                    if (indexA === indexB) {
                        continue;
                    }
                    else if (indexA === -1) {
                        return 1;
                    }
                    else if (indexB === -1) {
                        return -1;
                    }
                    else {
                        return indexA - indexB;
                    }
                }
                else {
                    // Ascending or descending order
                    var orderMultiplier = 1;
                    if (orderCriteria === "desc" || orderCriteria === -1) {
                        orderMultiplier = -1;
                    }
                    if (valueA === valueB) {
                        continue;
                    }
                    else if (valueA < valueB) {
                        return -1 * orderMultiplier;
                    }
                    else {
                        return 1 * orderMultiplier;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return 0;
    };
    return MessageAggregator;
}());
exports.MessageAggregator = MessageAggregator;
//# sourceMappingURL=message-aggregator.js.map